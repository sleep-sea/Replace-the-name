// author.js - 作者面板交互

const authorPanel = document.getElementById('authorPanel');
const gistIdInput = document.getElementById('gistIdInput');
const verifyBtn = document.getElementById('verifyGistBtn');
const shareContainer = document.getElementById('shareLinkContainer');
const shareInput = document.getElementById('shareLinkInput');
const copyBtn = document.getElementById('copyLinkBtn');
const previewArea = document.getElementById('previewArea');
const previewContent = document.getElementById('previewContent');

let currentGistId = null;      // 当前验证通过的 Gist ID
let currentArticle = null;     // 当前 Gist 的文章内容

// 验证 Gist 并显示预览，同时自动生成分享链接
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
    copyBtn.addEventListener('click', copyShareLink);
}

if (authorPanel) initAuthorPanel();
