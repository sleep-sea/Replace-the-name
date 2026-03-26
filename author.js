// author.js - 作者面板交互

const authorPanel = document.getElementById('authorPanel');
const gistIdInput = document.getElementById('gistIdInput');
const verifyBtn = document.getElementById('verifyGistBtn');
const generateBtn = document.getElementById('generateLinkBtn');
const shareContainer = document.getElementById('shareLinkContainer');
const shareInput = document.getElementById('shareLinkInput');
const copyBtn = document.getElementById('copyLinkBtn');
const articlePreviewArea = document.getElementById('articlePreviewArea');
const articlePreviewContent = document.getElementById('articlePreviewContent');

let currentGistId = null;      // 当前验证通过的 Gist ID
let currentArticle = null;     // 当前 Gist 的文章内容

// 验证 Gist 并显示预览
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
        articlePreviewArea.classList.remove('hidden');
        // 预览内容限制高度，可滚动
        articlePreviewContent.innerText = content;
        showToast('Gist 验证成功，文章已加载', 'success');
    } catch (err) {
        console.error(err);
        showToast(err.message, 'warning');
        articlePreviewArea.classList.add('hidden');
        currentGistId = null;
        currentArticle = null;
    } finally {
        verifyBtn.disabled = false;
        verifyBtn.textContent = '🔍 验证并加载';
    }
}

// 生成分享链接
function generateShareLink() {
    if (!currentGistId || !currentArticle) {
        showToast('请先验证并加载 Gist', 'warning');
        return;
    }

    const longUrl = buildGistShareUrl(currentGistId);
    shareInput.value = longUrl;
    shareContainer.classList.remove('hidden');
    navigator.clipboard.writeText(longUrl).then(() => {
        showToast('链接已复制到剪贴板', 'success');
    }).catch(() => {
        showToast('链接已生成，请手动复制', 'info');
    });
}

// 复制链接
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

// 初始化作者面板
function initAuthorPanel() {
    verifyBtn.addEventListener('click', verifyAndPreview);
    generateBtn.addEventListener('click', generateShareLink);
    copyBtn.addEventListener('click', copyShareLink);

    // 如果之前有保存的草稿（可选，这里可以清空或保留）
    // 不需要自动保存，因为 Gist 内容在外部维护
}

if (authorPanel) initAuthorPanel();