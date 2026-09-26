// @charset "UTF-8";

/**<CSSPATH_START>**/const cssFilePath = "https://cdn.script-forge.top/Scriptforge-css.css";/**<CSSPATH_END>**/

/**
 * 卡片序列依次入场动画
 * @param {number} [time=120] 两张卡片之间间隔毫秒
 */
function revealCardsSequentially(time = 120) {
  // 判断DOM是否已经就绪
  if (document.readyState === "loading") {
    // 还没加载完，监听一次
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    // DOM已经就绪，立刻执行
    run();
  }

  function run() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, index * time);
    });
  }
}

/**
 * 重置卡片显示状态
 */
function resetCardReveal(){
  document.querySelectorAll('.card').forEach(c=>c.classList.remove('visible'));
}

/**
 * 切换主题
 * @param {string} themeCssPath CSS文件路径
 */
function switchTheme(themeCssPath) {
  const link = document.getElementById('theme-style');
  link.href = themeCssPath;
}

/**
 * 菜单
 * 可以用pos="top"或者pos="bottom"定义位置
 */
class SFMenu extends HTMLElement {
  constructor() {
    super();

    // 创建 Shadow DOM（隔离样式和结构）
    const shadow = this.attachShadow({ mode: 'open' });

    // 定义模板结构（允许用户插入内容）
    const template = document.createElement('template');
    template.innerHTML = `
<link id="theme-style" rel="stylesheet" href="${cssFilePath}">
  <nav class="menu" role="navigation">
            <div class="menu-inner">
              <ul class="menu-list">
                <slot></slot>
              </ul>
              <div class="sf-menu-right">
              <slot name="right"></slot>
              </div>
            </div>
          </nav>
`;

    // 将模板内容插入 Shadow DOM
    shadow.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('sf-menu', SFMenu);

function changeTheme() {
  const toggleButton = document.getElementById('toggle-theme');
  const body = document.body;

  // 切换主题
  toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
  });
}



/**
 * toast
 */
class SFToast extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `
<link id="theme-style" rel="stylesheet" href="${cssFilePath}">
<div id="toast-container" class="toast-container"></div>
`;

    shadow.appendChild(template.content.cloneNode(true));

    this._container = shadow.getElementById('toast-container');
  }

  showToast(message, time = 2500) {
    // 每次调用都创建一个新的 toast 节点
    const toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.textContent = message;

    this._container.appendChild(toastEl);

    // 下一帧再加 show 类，触发过渡动画（如果有 CSS transition）
    requestAnimationFrame(() => {
      toastEl.classList.add('show');
    });

    // 到时间后隐藏并移除这个节点，跟其他 toast 互不影响
    setTimeout(() => {
      toastEl.classList.remove('show');

      setTimeout(() => {
        toastEl.remove();
      }, 100);
    }, time);
  }
}

customElements.define('sf-toast', SFToast);