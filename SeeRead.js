// ==UserScript==
// @name         SeeRead
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Double-click to activate reading mode with a full Windows 7 UI style, real translation, and full functionality.
// @author       Moude AI
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // Add Windows 7 Style CSS
    GM_addStyle(`
        /* Windows 7 Glass Effect */
        #reader-container {
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            width: 80vw;
            height: 80vh;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 12px;
            border: 1px solid #a1a1a1;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            color: #000;
            overflow-y: auto;
            padding: 20px;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            z-index: 99999;
        }

        /* Windows 7 Header */
        #reader-header {
            width: 100%;
            height: 40px;
            background: linear-gradient(to bottom, #c8d8eb, #a2b5d9);
            border-bottom: 1px solid #6b87b2;
            display: flex;
            align-items: center;
            padding: 5px 15px;
            box-shadow: inset 0 -2px 3px rgba(255, 255, 255, 0.8);
            border-radius: 12px 12px 0 0;
        }

        #reader-header-title {
            flex-grow: 1;
            font-size: 16px;
            font-weight: bold;
            color: #333;
            text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.8);
        }

        /* Windows 7 Buttons */
        .reader-btn {
            width: 30px;
            height: 30px;
            margin-left: 8px;
            border: none;
            background: linear-gradient(to bottom, #f5f5f5, #dcdcdc);
            border-radius: 6px;
            box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.8),
                        inset -2px -2px 4px rgba(0, 0, 0, 0.2),
                        1px 1px 2px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .reader-btn:hover {
            background: linear-gradient(to bottom, #eaeaea, #c8c8c8);
        }

        /* Close Button (Red X) */
        #close-reader::before {
            content: "";
            width: 12px;
            height: 12px;
            background: radial-gradient(circle, #ff5a5a 40%, #b22222 100%);
            border-radius: 50%;
            box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.6),
                        inset -2px -2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Night Mode Button (Moon Icon) */
        #toggle-darkmode::before {
            content: "";
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: linear-gradient(135deg, #222, #666);
            box-shadow: -4px -4px 0 2px white inset;
        }

        /* Translate Button (Globe Icon) */
        #translate::before {
            content: "";
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: radial-gradient(circle, transparent 40%, #007bff 40%);
            box-shadow: inset 0 -3px 0 1px white, inset 0 3px 0 1px white;
        }

        .dark-mode {
            background: rgba(20, 20, 20, 0.9) !important;
            color: white !important;
        }

        .dark-mode #reader-header {
            background: linear-gradient(to bottom, #444, #222);
        }

        /* Title No Background (Windows 7 Style) */
        #reader-header-title {
            text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.8);
            background: none;
        }

        /* Apply glowing effect to elements */
        .reader-btn,
        #reader-header-title {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.6), 0 0 10px rgba(255, 255, 255, 0.8), 0 0 15px rgba(255, 255, 255, 1);
        }
    `);

    // Listen for double-click event
    document.addEventListener('dblclick', function () {
        if (document.getElementById('reader-container')) return; // Prevent duplicate reader

        // Extract main content
        let articleContent = document.body.innerText;
        let articleImages = document.querySelectorAll("img");

        // Create reader container
        let readerContainer = document.createElement("div");
        readerContainer.id = "reader-container";

        let readerHeader = document.createElement("div");
        readerHeader.id = "reader-header";

        let headerTitle = document.createElement("div");
        headerTitle.id = "reader-header-title";
        headerTitle.innerText = "SeeRead";

        let closeBtn = document.createElement("button");
        closeBtn.id = "close-reader";
        closeBtn.className = "reader-btn";
        closeBtn.onclick = () => document.body.removeChild(readerContainer);

        let darkModeBtn = document.createElement("button");
        darkModeBtn.id = "toggle-darkmode";
        darkModeBtn.className = "reader-btn";
        darkModeBtn.onclick = () => readerContainer.classList.toggle("dark-mode");

        let translateBtn = document.createElement("button");
        translateBtn.id = "translate";
        translateBtn.className = "reader-btn";
        translateBtn.onclick = function () {
            let targetLang = 'en'; // Change this to any language code
            let script = document.createElement('script');
            script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
            document.body.appendChild(script);
            window.googleTranslateElementInit = function () {
                new google.translate.TranslateElement(
                    { pageLanguage: 'auto', includedLanguages: targetLang, layout: google.translate.TranslateElement.InlineLayout.SIMPLE },
                    'reader-content'
                );
            };
        };

        readerHeader.appendChild(headerTitle);
        readerHeader.appendChild(translateBtn);
        readerHeader.appendChild(darkModeBtn);
        readerHeader.appendChild(closeBtn);

        let readerContent = document.createElement("div");
        readerContent.id = "reader-content";
        readerContent.innerHTML = `<p>${articleContent.replace(/\n/g, "</p ><p>")}</p >`;

        articleImages.forEach(img => {
            let imgClone = img.cloneNode();
            readerContent.appendChild(imgClone);
        });

        readerContainer.appendChild(readerHeader);
        readerContainer.appendChild(readerContent);
        document.body.appendChild(readerContainer);
    });
})();