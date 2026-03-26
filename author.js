// author.js - 作者面板交互
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const authorPanel = document.getElementById('authorPanel');
        const gistIdInput = document.getElementById('gistIdInput');
        const verifyBtn = document.getElementById('verifyGistBtn');
        const shareContainer = document.getElementById('shareLinkContainer');
        const shareInput = document.getElementById('shareLinkInput');
        const copyBtn = document.getElementById('copyLinkBtn');
        const previewArea = document.getElementById('previewArea');
        const previewContent = document.getElementById('previewContent');

        if (!verifyBtn || !gistIdInput || !shareContainer || !shareInput || !copyBtn || !previewArea || !previewContent) {
            console.error('Author panel missing required elements');
            return;
        }

        let currentGistId = null;
        let currentArticle = null;

        async function verifyAndPreview() {
            const gistId = gistIdInput.value.trim();
            if (!gistId) {
                showToast('请输入 Gist ID', 'warning');
                return;
            }

            verifyBtn.disabled = true;
            verifyBtn.textContent = '⏳ 验证中...';
            try {
                const content = await fetchGistContent(gistId);
                currentArticle = content;
                currentGistId = gistId;

                previewArea.classList.remove('hidden');
                previewContent.innerText = content;

                const longUrl = buildGistShareUrl(gistId);
                shareInput.value = longUrl;
                shareContainer.classList.remove('hidden');

                showToast('Gist 验证成功，链接已生成', 'success');
            } catch (err) {
                console.error(err);
                showToast(err.message, 'warning');
                previewArea.classList.add('hidden');
                shareContainer.classList.add('hidden');
                currentGistId = null;
                currentArticle = null;
            } finally {
                verifyBtn.disabled = false;
                verifyBtn.textContent = '🔍 验证并加载';
            }
        }

        function copyShareLink() {
            if (shareInput.value) {
                navigator.clipboard.writeText(shareInput.value).then(() => {
                    showToast('链接已复制', 'success');
                }).catch(() => {
                    shareInput.select();
                    document.execCommand('copy');
                    showToast('链接已复制', 'success');
                });
            }
        }

        verifyBtn.addEventListener('click', verifyAndPreview);
        copyBtn.addEventListener('click', copyShareLink);
    });
})();
