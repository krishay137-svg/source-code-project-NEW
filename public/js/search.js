/* ======================================================
   EduShare - search.js
   Part 5 — Search & Discovery

   Responsibilities:
     - Read initial state from URL query params
     - Live debounced search on input (400 ms)
     - Category, tag, and sort filter interactions
     - Dynamic rendering: note cards, trending strip,
       category list, tag chips, pagination
     - Active-filter pills with individual clear buttons
     - URL synchronisation via history.pushState
     - Accessible mobile sidebar toggle
====================================================== */

(function () {

    "use strict";

    /* --------------------------------------------------
       Constants
    -------------------------------------------------- */

    var DEBOUNCE_MS      = 400;
    var RESULTS_PER_PAGE = 12;

    /* --------------------------------------------------
       State
    -------------------------------------------------- */

    var state = {
        keyword:    "",
        subject_id: "",
        tag:        "",
        sort:       "newest",
        page:       1
    };

    /* --------------------------------------------------
       DOM references (cached once on DOMContentLoaded)
    -------------------------------------------------- */

    var searchInput     = null;
    var searchClearBtn  = null;
    var categoryList    = null;
    var sortSelect      = null;
    var tagsContainer   = null;
    var resultsGrid     = null;
    var resultsCount    = null;
    var emptyState      = null;
    var loadingState    = null;
    var pagination      = null;
    var activeFilters   = null;
    var trendingScroll  = null;
    var filterToggleBtn = null;
    var searchSidebar   = null;

    var debounceTimer = null;

    /* --------------------------------------------------
       Utilities
    -------------------------------------------------- */

    function debounce(fn) {
        return function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(fn, DEBOUNCE_MS);
        };
    }

    /**
     * Safely HTML-encode a string to prevent XSS when
     * inserting user-controlled content into innerHTML.
     */
    function esc(str) {
        if (str === null || str === undefined) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function formatSize(bytes) {
        if (!bytes || isNaN(bytes)) return "";
        if (bytes < 1024)             return bytes + " B";
        if (bytes < 1024 * 1024)      return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    function formatDate(dateStr) {
        if (!dateStr) return "";
        try {
            var d = new Date(dateStr);
            return d.toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric"
            });
        } catch (e) {
            return "";
        }
    }

    /** Map a file extension string to a CSS class. */
    function fileBadgeClass(fileType) {
        if (!fileType) return "other";
        var ext = fileType.toLowerCase().replace(/^\./, "");
        if (ext === "pdf")                        return "pdf";
        if (ext === "doc"  || ext === "docx")     return "docx";
        if (ext === "ppt"  || ext === "pptx")     return "ppt";
        if (ext === "jpg"  || ext === "jpeg"
                           || ext === "png")      return "jpg";
        return "other";
    }

    /* --------------------------------------------------
       URL / State synchronisation
    -------------------------------------------------- */

    function readUrlParams() {
        var p         = new URLSearchParams(window.location.search);
        state.keyword    = p.get("keyword")    || "";
        state.subject_id = p.get("subject_id") || "";
        state.tag        = p.get("tag")        || "";
        state.sort       = p.get("sort")       || "newest";
        state.page       = parseInt(p.get("page")) || 1;
    }

    function pushUrlParams() {
        var p = new URLSearchParams();
        if (state.keyword)                   p.set("keyword",    state.keyword);
        if (state.subject_id)                p.set("subject_id", state.subject_id);
        if (state.tag)                       p.set("tag",        state.tag);
        if (state.sort && state.sort !== "newest") p.set("sort", state.sort);
        if (state.page > 1)                  p.set("page",       state.page);
        var url = window.location.pathname + (p.toString() ? "?" + p.toString() : "");
        history.pushState(null, "", url);
    }

    /* --------------------------------------------------
       Lightweight XHR helper
    -------------------------------------------------- */

    function getJSON(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    callback(null, JSON.parse(xhr.responseText));
                } catch (e) {
                    callback(new Error("JSON parse error"));
                }
            } else {
                callback(new Error("HTTP " + xhr.status));
            }
        };
        xhr.send();
    }

    /* --------------------------------------------------
       Render: Trending strip
    -------------------------------------------------- */

    function renderTrending(notes) {
        if (!trendingScroll) return;

        if (!notes || notes.length === 0) {
            trendingScroll.innerHTML =
                "<span style='color:#aaa;font-size:13px;'>No trending notes yet.</span>";
            return;
        }

        trendingScroll.innerHTML = notes.map(function (note) {
            var query = "keyword=" + encodeURIComponent(note.title);
            return (
                "<a href='/search?" + esc(query) + "' class='trending-pill' role='listitem'>" +
                    esc(note.title) +
                    "<span class='pill-count'>↓ " + (note.download_count || 0) + "</span>" +
                "</a>"
            );
        }).join("");
    }

    /* --------------------------------------------------
       Render: Sidebar — categories
    -------------------------------------------------- */

    function renderCategories(subjects) {
        if (!categoryList) return;

        // Always start with the "All" button
        var html = "<li>" +
            "<button class='category-btn" + (state.subject_id === "" ? " active" : "") + "'" +
            " data-id='' id='cat-all'>All Subjects</button>" +
            "</li>";

        subjects.forEach(function (s) {
            var isActive = String(state.subject_id) === String(s.id);
            html += "<li>" +
                "<button class='category-btn" + (isActive ? " active" : "") + "'" +
                " data-id='" + esc(s.id) + "'>" +
                esc(s.name) +
                "</button>" +
                "</li>";
        });

        categoryList.innerHTML = html;

        // Attach click listeners to all buttons
        categoryList.querySelectorAll(".category-btn").forEach(function (btn) {
            btn.addEventListener("click", onCategoryClick);
        });
    }

    /* --------------------------------------------------
       Render: Sidebar — tag chips
    -------------------------------------------------- */

    function renderTags(tags) {
        if (!tagsContainer) return;

        if (!tags || tags.length === 0) {
            tagsContainer.innerHTML =
                "<span style='color:#aaa;font-size:12px;'>No tags yet.</span>";
            return;
        }

        tagsContainer.innerHTML = tags.map(function (t) {
            var isActive = state.tag === t.name;
            return (
                "<button class='tag-chip" + (isActive ? " active" : "") + "'" +
                " data-tag='" + esc(t.name) + "' role='listitem'>#" +
                esc(t.name) + "</button>"
            );
        }).join("");

        tagsContainer.querySelectorAll(".tag-chip").forEach(function (chip) {
            chip.addEventListener("click", onTagClick);
        });
    }

    /* --------------------------------------------------
       Render: Single note card HTML
    -------------------------------------------------- */

    function buildNoteCard(note) {
        var badge     = fileBadgeClass(note.file_type);
        var tags      = Array.isArray(note.tags) ? note.tags : [];
        var viewQuery = "keyword=" + encodeURIComponent(note.title);

        var subjectHtml = note.subject_name
            ? "<span class='note-subject'>" + esc(note.subject_name) + "</span>"
            : "";

        var descHtml = note.description
            ? "<p class='note-desc'>" + esc(note.description) + "</p>"
            : "";

        var tagsHtml = tags.length > 0
            ? "<div class='note-tags'>" +
              tags.slice(0, 3).map(function (t) {
                  return "<button class='note-tag' data-tag='" + esc(t) + "'>#" + esc(t) + "</button>";
              }).join("") +
              "</div>"
            : "";

        var semHtml = note.semester
            ? "<span>📅 Sem&nbsp;" + esc(note.semester) + "</span>"
            : "";

        var sizeHtml = note.file_size
            ? "<span>💾 " + formatSize(note.file_size) + "</span>"
            : "";

        return (
            "<article class='note-card' role='listitem'>" +
                "<div class='note-card-top'>" +
                    "<span class='note-title'>" + esc(note.title) + "</span>" +
                    "<span class='file-badge " + badge + "'>" + esc(note.file_type || "FILE") + "</span>" +
                "</div>" +
                subjectHtml +
                descHtml +
                tagsHtml +
                "<div class='note-meta'>" +
                    "<span>👤 " + esc(note.uploader_name || "Anonymous") + "</span>" +
                    "<span>📥 " + (note.download_count || 0) + "</span>" +
                    "<span>👁 "  + (note.view_count     || 0) + "</span>" +
                    semHtml +
                    sizeHtml +
                "</div>" +
                "<div class='note-card-footer'>" +
                    "<a href='/search?" + esc(viewQuery) + "' class='note-view-btn'>View Note</a>" +
                    "<a href='/login' class='note-download-btn' title='Login to download'>↓</a>" +
                "</div>" +
            "</article>"
        );
    }

    /* --------------------------------------------------
       Render: Results grid
    -------------------------------------------------- */

    function renderResults(notes, paginationData) {
        loadingState.hidden = true;
        resultsGrid.innerHTML = "";
        emptyState.hidden = true;

        if (!notes || notes.length === 0) {
            emptyState.hidden = false;
            resultsCount.textContent = "No notes found";
            pagination.innerHTML = "";
            return;
        }

        var total      = paginationData ? paginationData.total      : notes.length;
        var curPage    = paginationData ? paginationData.page       : 1;
        var totalPages = paginationData ? paginationData.totalPages : 1;

        resultsCount.textContent =
            total + " note" + (total !== 1 ? "s" : "") + " found";

        resultsGrid.innerHTML = notes.map(buildNoteCard).join("");

        // Tag clicks inside note cards filter by that tag
        resultsGrid.querySelectorAll(".note-tag").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var t = this.dataset.tag;
                if (t) {
                    state.tag  = t;
                    state.page = 1;
                    syncUI();
                    pushUrlParams();
                    runSearch();
                }
            });
        });

        renderPagination(curPage, totalPages);
    }

    /* --------------------------------------------------
       Render: Pagination bar
    -------------------------------------------------- */

    function renderPagination(curPage, totalPages) {
        if (!pagination) return;
        if (totalPages <= 1) { pagination.innerHTML = ""; return; }

        var html = "";

        // Previous
        html += "<button class='page-btn' id='pg-prev'" +
            (curPage <= 1 ? " disabled" : "") + ">← Prev</button>";

        // Page numbers with ellipsis
        var start = Math.max(1, curPage - 2);
        var end   = Math.min(totalPages, curPage + 2);

        if (start > 1) {
            html += "<button class='page-btn' data-page='1'>1</button>";
            if (start > 2) html += "<span class='page-ellipsis'>…</span>";
        }

        for (var i = start; i <= end; i++) {
            html += "<button class='page-btn" + (i === curPage ? " active" : "") + "'" +
                " data-page='" + i + "'>" + i + "</button>";
        }

        if (end < totalPages) {
            if (end < totalPages - 1) html += "<span class='page-ellipsis'>…</span>";
            html += "<button class='page-btn' data-page='" + totalPages + "'>" + totalPages + "</button>";
        }

        // Next
        html += "<button class='page-btn' id='pg-next'" +
            (curPage >= totalPages ? " disabled" : "") + ">Next →</button>";

        pagination.innerHTML = html;

        // Click events on numbered buttons
        pagination.querySelectorAll(".page-btn[data-page]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                state.page = parseInt(this.dataset.page);
                pushUrlParams();
                runSearch();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        });

        var prevBtn = document.getElementById("pg-prev");
        var nextBtn = document.getElementById("pg-next");

        if (prevBtn) {
            prevBtn.addEventListener("click", function () {
                if (state.page > 1) {
                    state.page--;
                    pushUrlParams();
                    runSearch();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", function () {
                if (state.page < totalPages) {
                    state.page++;
                    pushUrlParams();
                    runSearch();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            });
        }
    }

    /* --------------------------------------------------
       Render: Active filter pills
    -------------------------------------------------- */

    function renderActiveFilters() {
        if (!activeFilters) return;
        var html = "";

        if (state.keyword) {
            html += "<span class='filter-pill'>🔍 " + esc(state.keyword) +
                " <button data-clear='keyword' aria-label='Remove keyword filter'>✕</button></span>";
        }

        if (state.subject_id) {
            // Grab the label from the active category button
            var activeCatBtn = categoryList
                ? categoryList.querySelector(".category-btn.active")
                : null;
            var subjectLabel = activeCatBtn ? activeCatBtn.textContent : "Subject";
            html += "<span class='filter-pill'>📚 " + esc(subjectLabel) +
                " <button data-clear='subject_id' aria-label='Remove subject filter'>✕</button></span>";
        }

        if (state.tag) {
            html += "<span class='filter-pill'>🏷️ #" + esc(state.tag) +
                " <button data-clear='tag' aria-label='Remove tag filter'>✕</button></span>";
        }

        activeFilters.innerHTML = html;

        activeFilters.querySelectorAll("button[data-clear]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var field = this.dataset.clear;
                if      (field === "keyword")    { state.keyword = ""; searchInput.value = ""; updateClearBtn(); }
                else if (field === "subject_id") { state.subject_id = ""; }
                else if (field === "tag")        { state.tag = ""; }
                state.page = 1;
                syncUI();
                pushUrlParams();
                runSearch();
            });
        });
    }

    /* --------------------------------------------------
       Sync UI elements to state
    -------------------------------------------------- */

    function updateClearBtn() {
        if (!searchClearBtn) return;
        if (state.keyword) {
            searchClearBtn.classList.add("visible");
        } else {
            searchClearBtn.classList.remove("visible");
        }
    }

    function syncUI() {
        // Input field
        if (searchInput) {
            searchInput.value = state.keyword;
            updateClearBtn();
        }

        // Sort dropdown
        if (sortSelect) {
            sortSelect.value = state.sort;
        }

        // Category buttons
        if (categoryList) {
            categoryList.querySelectorAll(".category-btn").forEach(function (btn) {
                btn.classList.toggle("active",
                    String(btn.dataset.id) === String(state.subject_id));
            });
        }

        // Tag chips
        if (tagsContainer) {
            tagsContainer.querySelectorAll(".tag-chip").forEach(function (chip) {
                chip.classList.toggle("active", chip.dataset.tag === state.tag);
            });
        }

        renderActiveFilters();
    }

    /* --------------------------------------------------
       Event handlers
    -------------------------------------------------- */

    function onCategoryClick() {
        state.subject_id = this.dataset.id || "";
        state.page       = 1;
        syncUI();
        pushUrlParams();
        runSearch();
    }

    function onTagClick() {
        // Clicking the active tag deselects it
        state.tag  = (state.tag === this.dataset.tag) ? "" : this.dataset.tag;
        state.page = 1;
        syncUI();
        pushUrlParams();
        runSearch();
    }

    /* --------------------------------------------------
       Loading state helpers
    -------------------------------------------------- */

    function showLoading() {
        resultsGrid.innerHTML  = "";
        emptyState.hidden      = true;
        loadingState.hidden    = false;
        pagination.innerHTML   = "";
        resultsCount.textContent = "Searching...";
    }

    /* --------------------------------------------------
       Core search execution
    -------------------------------------------------- */

    function runSearch() {
        showLoading();

        var p = new URLSearchParams();
        if (state.keyword)    p.set("keyword",    state.keyword);
        if (state.subject_id) p.set("subject_id", state.subject_id);
        if (state.tag)        p.set("tag",        state.tag);
        p.set("sort",  state.sort);
        p.set("page",  state.page);
        p.set("limit", RESULTS_PER_PAGE);

        getJSON("/search/results?" + p.toString(), function (err, data) {

            if (err || !data || !data.success) {
                loadingState.hidden = true;
                resultsCount.textContent = "Error";
                resultsGrid.innerHTML =
                    "<p style='grid-column:1/-1;text-align:center;color:#e53935;padding:50px;font-size:15px;'>" +
                    "Failed to load results. Please try again.</p>";
                return;
            }

            renderResults(data.notes, data.pagination);
            renderActiveFilters();
        });
    }

    /* --------------------------------------------------
       Load sidebar data (categories, tags) and trending
    -------------------------------------------------- */

    function loadCategories() {
        getJSON("/search/categories", function (err, data) {
            if (!err && data && data.success) {
                renderCategories(data.subjects);
                // Re-apply active state after rendering
                syncUI();
            }
        });
    }

    function loadPopularTags() {
        getJSON("/search/tags?limit=15", function (err, data) {
            if (!err && data && data.success) {
                renderTags(data.tags);
                syncUI();
            }
        });
    }

    function loadTrending() {
        getJSON("/search/trending?limit=8", function (err, data) {
            if (!err && data && data.success) {
                renderTrending(data.notes);
            }
        });
    }

    /* --------------------------------------------------
       Event bindings
    -------------------------------------------------- */

    function bindEvents() {

        /* Search input — debounced */
        if (searchInput) {

            searchInput.addEventListener("input", debounce(function () {
                state.keyword = searchInput.value.trim();
                state.page    = 1;
                updateClearBtn();
                pushUrlParams();
                runSearch();
            }));

            searchInput.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    clearTimeout(debounceTimer);
                    state.keyword = searchInput.value.trim();
                    state.page    = 1;
                    updateClearBtn();
                    pushUrlParams();
                    runSearch();
                }
            });
        }

        /* Clear button */
        if (searchClearBtn) {
            searchClearBtn.addEventListener("click", function () {
                state.keyword = "";
                state.page    = 1;
                searchInput.value = "";
                updateClearBtn();
                pushUrlParams();
                runSearch();
            });
        }

        /* Sort dropdown */
        if (sortSelect) {
            sortSelect.addEventListener("change", function () {
                state.sort = sortSelect.value;
                state.page = 1;
                pushUrlParams();
                runSearch();
            });
        }

        /* Mobile filter toggle */
        if (filterToggleBtn && searchSidebar) {
            filterToggleBtn.addEventListener("click", function () {
                var open = searchSidebar.classList.toggle("sidebar-visible");
                filterToggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
            });
        }

        /* Browser back / forward */
        window.addEventListener("popstate", function () {
            readUrlParams();
            syncUI();
            runSearch();
        });
    }

    /* --------------------------------------------------
       Initialisation
    -------------------------------------------------- */

    function init() {

        /* Cache DOM references */
        searchInput     = document.getElementById("search-input");
        searchClearBtn  = document.getElementById("search-clear-btn");
        categoryList    = document.getElementById("category-list");
        sortSelect      = document.getElementById("sort-select");
        tagsContainer   = document.getElementById("tags-container");
        resultsGrid     = document.getElementById("results-grid");
        resultsCount    = document.getElementById("results-count");
        emptyState      = document.getElementById("empty-state");
        loadingState    = document.getElementById("loading-state");
        pagination      = document.getElementById("pagination");
        activeFilters   = document.getElementById("active-filters");
        trendingScroll  = document.getElementById("trending-scroll");
        filterToggleBtn = document.getElementById("filter-toggle-btn");
        searchSidebar   = document.getElementById("search-sidebar");

        /* Read URL into state, then sync UI */
        readUrlParams();
        syncUI();

        /* Load sidebar and trending data */
        loadCategories();
        loadPopularTags();
        loadTrending();

        /* Bind all events */
        bindEvents();

        /* Run the initial search */
        runSearch();
    }

    document.addEventListener("DOMContentLoaded", init);

}());
