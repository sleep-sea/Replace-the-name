// author.js - 作者面板交互
document.addEventListener('DOMContentLoaded', () => {
    // 获取所有需要操作的元素
    const authorPanel = document.getElementById('authorPanel');
    const gistIdInput = document.getElementById('gistIdInput');
    const verifyBtn = document.getElementById('verifyGistBtn');
    const shareContainer = document.getElementById('shareLinkContainer');
    const shareInput = document.getElementById('shareLinkInput');
    const copyBtn = document.getElementById('copyLinkBtn');
    const previewArea = document.getElementById('previewArea');
    const previewContent = document.getElementById('previewContent');

    // 检查关键元素是否存在，如果缺失则提前退出并输出错误
    if (!verifyBtn || !gistIdInput || !shareContainer || !shareInput || !copyBtn || !previewArea || !previewContent) {
        console.error('Author panel missing required elements:', {
            verifyBtn, gistIdInput, shareContainer, shareInput, copyBtn, previewArea, previewContent
        });
        // 可选：在页面显示友好的错误提示
        if (authorPanel) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'deploy-tip';
            errorDiv.style.background = '#ffdddd';
            errorDiv.style.color = '#b00020';
            errorDiv.innerText = '页面加载错误：缺少必要组件，请检查 index.html 是否正确部署。';
            authorPanel.querySelector('.card-content')?.prepend(errorDiv);
        }
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

            // 显示预览区域
            previewArea.classList.remove('hidden');
            previewContent.innerText = content;

            // 自动生成分享链接并显示复制框
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
