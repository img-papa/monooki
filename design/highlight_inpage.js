/*

このスクリプトは以下のサイトで配布されているものです。

【みんなの知識 ちょっと便利帳】
https://www.benricho.org/Tips/ctrl_F/highlight_inpage/

ページ内検索を自サイトに設置する方法 - How to Implement In-Page Search on Your Web Page. ヒットしたテキストをハイライト表示・対象の文字へスクロール

*/

let highlights = [];            // ハイライトされた要素を格納する配列
let currentIndex = -1;          // 現在のハイライト位置を示すインデックス
let lastSearchTerm = '';        // 最後に検索された語句を保持する変数
let searchTimer = null;         // 入力変更後に検索を遅延させるためのタイマー
let isComposing = false;        // 入力中の状態を保持
let caseSensitive = false;      // 大文字小文字の区別フラグ（デフォルトは区別しない）

/**
 * 特殊文字をエスケープする関数
 * @param {string} string - エスケープする文字列
 * @returns {string} - エスケープされた文字列
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 検索を実行し、マッチしたテキストをハイライトする関数
 * @param {string} searchTerm - 検索語
 */
function search(searchTerm) {
    if (!searchTerm || searchTerm === lastSearchTerm) return;

    lastSearchTerm = searchTerm;
    resetHighlights();

    searchTerm = escapeRegExp(searchTerm);

    const content = document.getElementById('contents');
    searchAndHighlight(content, searchTerm);

    if (highlights.length > 0) {
        currentIndex = 0;
        scrollToHighlight(currentIndex);
    }

    document.getElementById('searchTerm').focus();
}

/**
 * テキストノード内で検索語を見つけてハイライトする関数
 * @param {Node} element - 検索対象のノード
 * @param {string} searchTerm - 検索語
 */
function searchAndHighlight(element, searchTerm) {
    if (element.nodeType === 3) { // テキストノード
        const regex = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi');
        const matches = element.textContent.match(regex);
        if (matches) {
            const parent = element.parentNode;
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            matches.forEach(match => {
                const matchStart = element.textContent.indexOf(match, lastIndex);
                const matchEnd = matchStart + match.length;

                fragment.appendChild(document.createTextNode(element.textContent.slice(lastIndex, matchStart)));

                const span = document.createElement('span');
                span.className = 'highlight';
                span.textContent = match;
                fragment.appendChild(span);

                lastIndex = matchEnd;
                highlights.push(span);
            });

            fragment.appendChild(document.createTextNode(element.textContent.slice(lastIndex)));
            parent.replaceChild(fragment, element);
        }
    } else {
        Array.from(element.childNodes).forEach(child => searchAndHighlight(child, searchTerm));
    }
}

/**
 * 現在のハイライト要素にスクロールする関数
 * @param {number} index - ハイライト要素のインデックス
 */
function scrollToHighlight(index) {
    if (highlights.length > 0) {
        highlights.forEach(el => el.classList.remove('current'));
        highlights[index].classList.add('current');
        highlights[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * 次のハイライトに移動する関数
 */
function nextHighlight() {
    if (highlights.length > 0) {
        currentIndex = (currentIndex + 1) % highlights.length;
        scrollToHighlight(currentIndex);
    }
}

/**
 * 前のハイライトに移動する関数
 */
function previousHighlight() {
    if (highlights.length > 0) {
        currentIndex = (currentIndex - 1 + highlights.length) % highlights.length;
        scrollToHighlight(currentIndex);
    }
}

/**
 * ハイライトをリセットする関数
 */
function resetHighlights() {
    highlights.forEach(el => {
        el.outerHTML = el.innerHTML;
    });
    highlights = [];
    currentIndex = -1;
    lastSearchTerm = '';
}

/**
 * 検索をリセットし、入力枠にスクロールする関数
 */
function resetSearch() {
    resetHighlights();
    document.getElementById('searchTerm').value = '';
    scrollToSearchInput();
}

/**
 * 入力枠にスクロールする関数
 */
function scrollToSearchInput() {
    const searchInput = document.getElementById('searchTerm');
    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    searchInput.focus(); // 入力枠にフォーカスも合わせる
}

/**
 * 検索の処理を実行する関数
 */
function handleSearch() {
    const searchTerm = document.getElementById('searchTerm').value;

    // 検索語句が空の場合にリセットし、入力枠にスクロールする
    if (searchTerm === '') {
        resetSearch();
        return;
    }

    if (searchTerm && searchTerm !== lastSearchTerm) {
        search(searchTerm);

        if (highlights.length === 0) {
            scrollToSearchInput();
        }
    }
}

document.getElementById('searchTerm').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const searchTerm = this.value;
        if (searchTerm) {
            if (currentIndex === -1) {
                handleSearch();
            } else {
                nextHighlight();
            }
        }
    }
});

document.getElementById('searchTerm').addEventListener('input', function() {
    if (searchTimer) clearTimeout(searchTimer);
    if (!isComposing) {
        searchTimer = setTimeout(handleSearch, 500);
    }
});

document.getElementById('searchTerm').addEventListener('compositionstart', function() {
    isComposing = true;
});

document.getElementById('searchTerm').addEventListener('compositionend', function() {
    isComposing = false;
    handleSearch();
});

document.querySelectorAll('input[name="caseOption"]').forEach(radio => {
    radio.addEventListener('change', handleCaseOptionChange);
});

/**
 * 大文字小文字の区別設定を変更する関数
 */
function handleCaseOptionChange() {
    caseSensitive = document.querySelector('input[name="caseOption"]:checked').value === 'sensitive';
    search(document.getElementById('searchTerm').value);
}
