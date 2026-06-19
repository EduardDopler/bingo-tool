import { Board } from "./core/board";
import { parseBingoInput } from "./core/parser";
import { UndoManager } from "./core/undo";

// Define the global application state structure
interface AppState {
  boards: Board[];
  activeBoardId: string;
  undoManager: UndoManager;
  sessionStartSnapshot: Board | null;
  pasteWarningMessage: string | null;
}

const appState: AppState = {
  boards: [],
  activeBoardId: "",
  undoManager: new UndoManager(),
  sessionStartSnapshot: null,
  pasteWarningMessage: null,
};

// --- Storage Integration ---

function saveToLocalStorage(): void {
  const serialized = appState.boards.map((b) => ({
    id: b.id,
    name: b.name,
    values: b.values,
    marked: b.marked,
  }));
  localStorage.setItem("bingo_boards", JSON.stringify(serialized));
  localStorage.setItem("bingo_active_id", appState.activeBoardId);
}

function loadFromLocalStorage(): void {
  try {
    const serializedBoards = localStorage.getItem("bingo_boards");
    const activeId = localStorage.getItem("bingo_active_id");

    if (serializedBoards) {
      const parsed = JSON.parse(serializedBoards);
      appState.boards = parsed.map(
        (b: any) => new Board(b.id, b.name, b.values, b.marked),
      );
      appState.activeBoardId = activeId || (appState.boards[0]?.id ?? "");
    }
  } catch (e) {
    console.error("Failed to load board state from localStorage:", e);
  }

  // Startup cleanup: discard any untouched boards that are not currently active
  appState.boards = appState.boards.filter((b) => {
    const isUntouched =
      b.values.every((v) => v === "") && b.marked.every((m) => !m);
    return !isUntouched || b.id === appState.activeBoardId;
  });

  // Fallback: If no boards exist, create a default one
  if (appState.boards.length === 0) {
    const defaultId = "board-" + Math.random().toString(36).substring(2, 11);
    const defaultName = generateDefaultBoardName([]);
    const defaultBoard = new Board(defaultId, defaultName);
    appState.boards.push(defaultBoard);
    appState.activeBoardId = defaultId;
  }
}

// --- Helper Utilities ---

function generateDefaultBoardName(boards: Board[]): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}-${mm}-${dd}`;

  let candidate = dateStr;
  let counter = 2;
  while (boards.some((b) => b.name === candidate)) {
    candidate = `${dateStr} (${counter})`;
    counter++;
  }
  return candidate;
}

function getActiveBoard(): Board {
  return (
    appState.boards.find((b) => b.id === appState.activeBoardId) ??
    appState.boards[0]
  );
}

// --- Action Handlers ---

function selectBoard(targetId: string): void {
  const currentBoard = getActiveBoard();
  if (currentBoard.id === targetId) return;

  // Discard the previous board if it is untouched/completely empty
  const isUntouched =
    currentBoard.values.every((v) => v === "") &&
    currentBoard.marked.every((m) => !m);
  if (isUntouched) {
    appState.boards = appState.boards.filter((b) => b.id !== currentBoard.id);
  }

  appState.activeBoardId = targetId;
  appState.undoManager.clear();
  appState.sessionStartSnapshot = null;
  appState.pasteWarningMessage = null;

  saveToLocalStorage();
  render();
}

function createNewBoard(): void {
  const currentBoard = getActiveBoard();

  // Discard the current board if it is untouched/completely empty
  const isUntouched =
    currentBoard.values.every((v) => v === "") &&
    currentBoard.marked.every((m) => !m);
  if (isUntouched) {
    appState.boards = appState.boards.filter((b) => b.id !== currentBoard.id);
  }

  const newId = "board-" + Math.random().toString(36).substring(2, 11);
  const name = generateDefaultBoardName(appState.boards);
  const newBoard = new Board(newId, name);

  appState.boards.push(newBoard);
  appState.activeBoardId = newId;
  appState.undoManager.clear();
  appState.sessionStartSnapshot = null;
  appState.pasteWarningMessage = null;

  saveToLocalStorage();
  render();
}

function deleteBoard(id: string): void {
  appState.boards = appState.boards.filter((b) => b.id !== id);

  if (appState.boards.length === 0) {
    const newId = "board-" + Math.random().toString(36).substring(2, 11);
    const newBoard = new Board(newId, generateDefaultBoardName([]));
    appState.boards.push(newBoard);
    appState.activeBoardId = newId;
  } else if (appState.activeBoardId === id) {
    appState.activeBoardId = appState.boards[0].id;
  }

  appState.undoManager.clear();
  appState.sessionStartSnapshot = null;
  appState.pasteWarningMessage = null;

  saveToLocalStorage();
  render();
}

function toggleMode(): void {
  const board = getActiveBoard();
  if (board.isEditMode) {
    // Exiting Edit Mode
    // Check if values changed in this session. If so, push the start snapshot to undo stack
    if (appState.sessionStartSnapshot) {
      const changed =
        JSON.stringify(appState.sessionStartSnapshot.values) !==
        JSON.stringify(board.values);
      if (changed) {
        appState.undoManager.push(appState.sessionStartSnapshot);
      }
    }
    board.setEditMode(false);
    appState.sessionStartSnapshot = null;
  } else {
    // Entering Edit Mode
    appState.sessionStartSnapshot = board.clone();
    board.setEditMode(true);
    appState.pasteWarningMessage = null; // Clear old warnings when starting edit
  }

  saveToLocalStorage();
  render();
}

function triggerUndo(): void {
  if (!appState.undoManager.canUndo()) return;
  const previousState = appState.undoManager.pop();
  if (previousState) {
    const board = getActiveBoard();
    board.values = [...previousState.values];
    board.marked = [...previousState.marked];

    // Clear warning banner since undoing returns to a valid/previous state
    appState.pasteWarningMessage = null;

    saveToLocalStorage();
    render();
  }
}

// --- DOM Rendering Engine ---

function render(): void {
  const container = document.getElementById("app");
  if (!container) return;

  const activeBoard = getActiveBoard();
  const winningIndices = activeBoard.getWinningIndices();

  // Create the skeletal dashboard card
  container.innerHTML = "";

  const dashboard = document.createElement("div");
  dashboard.className = "dashboard-container";

  // --- Sidebar Component ---
  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";

  const sidebarHeader = document.createElement("div");
  sidebarHeader.className = "sidebar-header";
  const sidebarTitle = document.createElement("h2");
  sidebarTitle.className = "sidebar-title";
  sidebarTitle.textContent = "Boards";
  sidebarHeader.appendChild(sidebarTitle);
  sidebar.appendChild(sidebarHeader);

  const boardList = document.createElement("ul");
  boardList.className = "board-list";

  appState.boards.forEach((b) => {
    const item = document.createElement("li");
    item.className = `board-item ${b.id === activeBoard.id ? "active" : ""}`;

    const nameContainer = document.createElement("div");
    nameContainer.className = "board-item-name-container";

    const nameSpan = document.createElement("span");
    nameSpan.className = "board-item-name";
    nameSpan.textContent = b.name;
    nameContainer.appendChild(nameSpan);
    item.appendChild(nameContainer);

    // Click to switch board
    item.addEventListener("click", (e) => {
      // Don't trigger if clicked on delete or input
      if (
        (e.target as HTMLElement).closest(".board-item-actions") ||
        (e.target as HTMLElement).tagName === "INPUT"
      ) {
        return;
      }
      selectBoard(b.id);
    });

    // Double click to rename
    item.addEventListener("dblclick", () => {
      startRename(b.id, nameContainer);
    });

    // Hover actions (Edit/Rename and Delete)
    const actions = document.createElement("div");
    actions.className = "board-item-actions";

    // Rename Button
    const renameBtn = document.createElement("button");
    renameBtn.className = "btn-icon";
    renameBtn.title = "Rename";
    renameBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
      </svg>`;
    renameBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      startRename(b.id, nameContainer);
    });
    actions.appendChild(renameBtn);

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-danger-icon";
    deleteBtn.title = "Delete";
    deleteBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      </svg>`;
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`Are you sure you want to delete "${b.name}"?`)) {
        deleteBoard(b.id);
      }
    });
    actions.appendChild(deleteBtn);

    item.appendChild(actions);
    boardList.appendChild(item);
  });
  sidebar.appendChild(boardList);

  // New Board Button
  const newBoardBtn = document.createElement("button");
  newBoardBtn.className = "btn-primary";
  newBoardBtn.style.width = "100%";
  newBoardBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"></path>
      <path d="M12 5v14"></path>
    </svg> New Board`;
  newBoardBtn.addEventListener("click", createNewBoard);
  sidebar.appendChild(newBoardBtn);

  dashboard.appendChild(sidebar);

  // --- Main Board Area Component ---
  const boardArea = document.createElement("main");
  boardArea.className = "board-area";

  // Header of board area
  const boardHeader = document.createElement("header");
  boardHeader.className = "board-header";

  const titleSection = document.createElement("div");
  titleSection.className = "board-title-section";

  const title = document.createElement("h1");
  title.className = "active-board-name";
  title.textContent = activeBoard.name;
  titleSection.appendChild(title);

  const modeBadge = document.createElement("div");
  modeBadge.className = `mode-badge ${activeBoard.isEditMode ? "edit-mode" : ""}`;
  modeBadge.textContent = activeBoard.isEditMode ? "Edit Mode" : "Play Mode";
  titleSection.appendChild(modeBadge);
  boardHeader.appendChild(titleSection);

  // Control Buttons
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "button-group";

  // Undo button
  const undoBtn = document.createElement("button");
  undoBtn.className = "btn-secondary";
  undoBtn.disabled = !appState.undoManager.canUndo();
  undoBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 7v6h6"></path>
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
    </svg> Undo`;
  undoBtn.addEventListener("click", triggerUndo);
  buttonGroup.appendChild(undoBtn);

  // Toggle Mode button
  const toggleBtn = document.createElement("button");
  toggleBtn.className = activeBoard.isEditMode
    ? "btn-primary"
    : "btn-secondary";
  if (activeBoard.isEditMode) {
    toggleBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6 9 17l-5-5"></path>
      </svg> Exit Edit`;
  } else {
    toggleBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
      </svg> Edit Board`;
  }
  toggleBtn.addEventListener("click", toggleMode);
  buttonGroup.appendChild(toggleBtn);

  boardHeader.appendChild(buttonGroup);
  boardArea.appendChild(boardHeader);

  // --- Warning Banner Component ---
  if (appState.pasteWarningMessage) {
    const banner = document.createElement("div");
    banner.className = "warning-banner";

    const bannerContent = document.createElement("div");
    bannerContent.className = "warning-content";
    bannerContent.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      <span>${appState.pasteWarningMessage}</span>`;
    banner.appendChild(bannerContent);

    const closeBannerBtn = document.createElement("button");
    closeBannerBtn.className = "btn-icon";
    closeBannerBtn.style.padding = "4px";
    closeBannerBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"></path>
        <path d="m6 6 12 12"></path>
      </svg>`;
    closeBannerBtn.addEventListener("click", () => {
      appState.pasteWarningMessage = null;
      render();
    });
    banner.appendChild(closeBannerBtn);
    boardArea.appendChild(banner);
  }

  // --- 5x5 Grid Component ---
  const gridWrapper = document.createElement("div");
  gridWrapper.className = "grid-container-wrapper";

  const grid = document.createElement("div");
  grid.className = "grid-container";
  grid.id = "bingo-grid";

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    const isMarked = activeBoard.marked[i];
    const isWinning = winningIndices.has(i);

    cell.className = `grid-cell ${isMarked ? "marked" : ""} ${isWinning ? "winning-highlight" : ""}`;
    cell.dataset.index = String(i);

    if (activeBoard.isEditMode) {
      // Render as interactive input field
      const input = document.createElement("input");
      input.type = "text";
      input.className = "cell-input";
      input.value = activeBoard.values[i];
      input.maxLength = 2;
      input.dataset.index = String(i);

      // Focus input select-all utility
      input.addEventListener("focus", () => input.select());

      // Accept digits only
      input.addEventListener("keypress", (e) => {
        if (!/\d/.test(e.key)) {
          e.preventDefault();
        }
      });

      // Update value on input
      input.addEventListener("input", () => {
        activeBoard.updateCell(i, input.value);
        saveToLocalStorage();
      });

      // Pad zero on blur
      input.addEventListener("blur", () => {
        const val = input.value.trim();
        if (val) {
          const padded = val.length === 1 ? "0" + val : val;
          input.value = padded;
          activeBoard.updateCell(i, padded);
          saveToLocalStorage();
        }
      });

      // Keyboard navigation
      input.addEventListener("keydown", (e: KeyboardEvent) => {
        let targetIndex = -1;
        if (e.key === "ArrowUp") {
          targetIndex = i - 5;
        } else if (e.key === "ArrowDown") {
          targetIndex = i + 5;
        } else if (e.key === "ArrowLeft") {
          targetIndex = i - 1;
        } else if (e.key === "ArrowRight") {
          targetIndex = i + 1;
        } else if (e.key === "Enter") {
          input.blur();
          e.preventDefault();
        }

        if (targetIndex >= 0 && targetIndex < 25) {
          const targetInput = grid.querySelector(
            `input[data-index="${targetIndex}"]`,
          ) as HTMLInputElement;
          if (targetInput) {
            targetInput.focus();
            e.preventDefault();
          }
        }
      });

      cell.appendChild(input);
    } else {
      // Play Mode cell displaying value
      const valueSpan = document.createElement("span");
      valueSpan.className = "cell-value";
      valueSpan.textContent = activeBoard.values[i] || "--";
      cell.appendChild(valueSpan);

      // Handle marking click
      cell.addEventListener("click", () => {
        // Record undo state before marking toggle
        appState.undoManager.push(activeBoard.clone());
        activeBoard.toggleMark(i);
        saveToLocalStorage();
        render();
      });
    }

    grid.appendChild(cell);
  }
  gridWrapper.appendChild(grid);
  boardArea.appendChild(gridWrapper);

  // --- Paste Clipboard Area (Edit Mode Only) ---
  if (activeBoard.isEditMode) {
    const pasteContainer = document.createElement("div");
    pasteContainer.className = "paste-container";

    const pasteLabel = document.createElement("label");
    pasteLabel.className = "paste-label";
    pasteLabel.textContent = "Or Paste from Clipboard";
    pasteContainer.appendChild(pasteLabel);

    const pasteTextarea = document.createElement("textarea");
    pasteTextarea.className = "paste-textarea";
    pasteTextarea.placeholder =
      "Paste 25 numbers here. Any spacing or separator works.";

    // Process input text on pasting
    pasteTextarea.addEventListener("input", () => {
      const text = pasteTextarea.value;
      if (!text.trim()) return;

      const parseResult = parseBingoInput(text);

      // Update board cells sequentially
      for (let i = 0; i < 25; i++) {
        activeBoard.updateCell(i, parseResult.parsed[i]);
      }

      if (parseResult.hasWarning) {
        if (parseResult.count < 25) {
          appState.pasteWarningMessage = `Warning: Only ${parseResult.count} numbers found. Grid filled up to capacity, others left empty.`;
        } else {
          appState.pasteWarningMessage = `Warning: ${parseResult.count} numbers found. Overflowing values were discarded.`;
        }
      } else {
        appState.pasteWarningMessage = null;
      }

      // Clear textarea after parsing and re-render
      pasteTextarea.value = "";
      saveToLocalStorage();
      render();
    });

    pasteContainer.appendChild(pasteTextarea);

    const keyboardHints = document.createElement("div");
    keyboardHints.className = "keyboard-hints";
    keyboardHints.innerHTML = `
      <span>Use <span class="key-badge">▲</span> <span class="key-badge">▼</span> <span class="key-badge">◀</span> <span class="key-badge">▶</span> to navigate cells</span>
      <span>Press <span class="key-badge">Enter</span> to confirm cell edit</span>`;
    pasteContainer.appendChild(keyboardHints);

    boardArea.appendChild(pasteContainer);
  }

  dashboard.appendChild(boardArea);
  container.appendChild(dashboard);
}

// --- Inline Board Renaming utility ---

function startRename(boardId: string, nameContainer: HTMLElement): void {
  const board = appState.boards.find((b) => b.id === boardId);
  if (!board) return;

  nameContainer.innerHTML = "";
  const input = document.createElement("input");
  input.type = "text";
  input.className = "board-item-input";
  input.value = board.name;

  const finishRename = () => {
    const newName = input.value.trim();
    if (newName) {
      board.name = newName;
      saveToLocalStorage();
    }
    render();
  };

  input.addEventListener("blur", finishRename);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      finishRename();
    } else if (e.key === "Escape") {
      render(); // cancel
    }
  });

  nameContainer.appendChild(input);
  input.focus();
  input.select();
}

// --- Bootstrap Launcher ---

document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  render();
});

// --- PWA ---

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, {
        scope: `${import.meta.env.BASE_URL}`,
      })
      .then((reg) =>
        console.log("ServiceWorker registered with scope:", reg.scope),
      )
      .catch((err) => console.error("ServiceWorker registration failed:", err));
  });
}
