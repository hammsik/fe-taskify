import Button from '../../components/button.js';
import Card from '../../components/card.js';
import { autoResize, limitTextLength } from './textAreaHelper.js';

/**
 * 카드 생성 함수
 * @param {string} mode - 카드 모드
 * @param {Card} cardData - 카드 데이터
 * @param {function} columnState - 컬럼 상태
 * @returns {DocumentFragment} - 카드 요소를 포함하는 DocumentFragment
 */

const createCard = (mode, cardData, columnState) => {
  return Card(
    mode,
    cardData,
    (newData) =>
      columnState.setState((prevState) => ({
        ...prevState,
        cards: [newData, ...prevState.cards],
      })),
    (removeCardId) => {
      columnState.setState((prev) => ({
        ...prev,
        cards: prev.cards.filter((card) => card.id !== removeCardId),
      }));
    },
    (newData) =>
      columnState.setState((prevState) => ({
        ...prevState,
        cards: prevState.cards.map((card) =>
          newData.id === card.id ? newData : card
        ),
      }))
  );
};

/**
 * @typedef {Object} Card
 * @property {number} id - 카드 ID
 * @property {string} title - 카드 제목
 * @property {string} body - 카드 내용
 * @property {string} createdDate - 카드 생성일
 */

/**
 * 카드 모드에 따라 텍스트영역 세팅
 * @param {HTMLElement} cardElement
 * @param {Card} cardData
 * @param {function} setDisabled
 */
const initCardTextArea = (cardElement, cardData) => {
  const _h3 = cardElement.querySelector('h3');
  const _p = cardElement.querySelector('p');
  const _input = cardElement.querySelector('form input');
  const _textArea = cardElement.querySelector('form textarea');

  _input.value = _h3.textContent = cardData.title;
  _textArea.value = _p.textContent = cardData.body;

  _input.addEventListener('input', () => {
    cardElement
      .querySelectorAll('#button-area button')
      .forEach((button, index) => {
        if (index !== 0) {
          button.disabled =
            _input.value.trim() === '' || _textArea.value.trim() === '';
        }
      });
  });
  _textArea.addEventListener('input', () => {
    autoResize(_textArea);
    limitTextLength(_textArea);
    cardElement
      .querySelectorAll('#button-area button')
      .forEach((button, index) => {
        if (index !== 0) {
          button.disabled =
            _input.value.trim() === '' || _textArea.value.trim() === '';
        }
      });
  });
};

/**
 * display 속성을 toggle하는 함수
 * @param {HTMLElement} element
 * @param {boolean} isDisplay
 */
const toggleDisplay = (element, isDisplay) => {
  if (isDisplay) {
    element.style.display = 'flex';
  } else {
    element.style.display = 'none';
  }
};

/**
 * 카드 모드에 따라 아이콘 버튼 세팅
 * @param {HTMLElement} cardElement
 * @param {function} eventHandler1
 * @param {function} eventHandler2
 */
const initCardIconButtons = (cardElement, eventHandler1, eventHandler2) => {
  cardElement.querySelector('#delete-card').addEventListener('click', () => {
    eventHandler1();
  });
  cardElement
    .querySelector('#edit-card')
    .addEventListener('click', () => eventHandler2());
};

/**
 * 카드 모드에 따라 버튼 세팅
 * @param {HTMLElement} cardElement
 * @param {{name: string, handler: function}} buttonInfos
 */
const initCardButtons = (cardElement, buttonInfos) => {
  const buttonsArea = cardElement.querySelector('#button-area');

  buttonsArea.append(
    ...buttonInfos.map((buttonInfo) =>
      Button(buttonInfo.name, buttonInfo.handler)
    )
  );
};

/**
 * 카드 모드에 따라 그림자 세팅
 * @param {HTMLElement} cardElement
 * @param {'default' | 'add' | 'drag' | 'place'} mode
 */
const setCardShadow = (cardElement, mode) => {
  if (mode === 'drag') {
    cardElement.style.boxShadow = 'var(--shadow-floating)';
  } else {
    cardElement.style.boxShadow = 'var(--shadow-normal)';
  }
};

export {
  createCard,
  initCardTextArea,
  initCardIconButtons,
  initCardButtons,
  setCardShadow,
  toggleDisplay,
};
