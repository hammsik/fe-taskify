import CardMode from '../store/models/card-model.js';
import {
  initCardTextArea,
  initCardIconButtons,
  initCardButtons,
  setCardShadow,
  toggleDisplay,
} from '../utils/helpers/cardHelper.js';
import createState from '../utils/helpers/stateHelper.js';

/**
 * @typedef {Object} Card
 * @property {number} id - 카드 ID
 * @property {string} title - 카드 제목
 * @property {string} body - 카드 내용
 * @property {string} createdDate - 카드 생성일
 */

/**
 * 카드 컴포넌트
 * @param {'default' | 'add' | 'drag' | 'place'} mode - 카드 모드
 * @param {Card} cardData - 카드 데이터
 * @param {function} addCard - 카드 추가 함수
 * @param {function} deleteCard - 카드 삭제 함수
 * @returns {DocumentFragment} - 카드 요소를 포함하는 DocumentFragment
 */
const Card = (mode = 'default', cardData, addCard, deleteCard) => {
  const card = document.getElementById('card-template').content.cloneNode(true);

  /**
   * @type {HTMLElement}
   */
  const cardElement = card.querySelector('li');

  const cardState = createState(cardData);
  const cardMode = createState(new CardMode(mode, false));

  cardState.subscribe(() => {
    cardMode.setState(new CardMode('default', false));
  });

  cardMode.subscribe(() => {
    setCardState(cardElement, cardState.getState(), cardMode.getState());
  });

  initCardTextArea(cardElement, cardData);
  initCardIconButtons(
    cardElement,
    () => {
      cardElement.remove();
      deleteCard(cardData.id);
    },
    () => {
      cardMode.setState(() => {
        return { currentMode: 'add', isEditMode: true };
      });
    }
  );
  initCardButtons(cardElement, [
    {
      name: 'cancel',
      handler: () => {
        if (cardData.title === null && cardData.body === null) {
          cardElement.remove();
        } else {
          cardMode.setState(new CardMode('default', false));
          // TODO: 바뀐 데이터를 상위 요소에게 알려줘야 함
        }
      },
    },
    {
      name: 'add',
      handler: () => {
        applyCardChanges(cardElement, cardState);
        addCard(cardState.getState());
      },
      // TODO: 바뀐 데이터를 상위 요소에게 알려줘야 함
    },
    {
      name: 'edit',
      handler: () => {
        applyCardChanges(cardElement, cardState);
        addCard(cardState.getState());
      },
      // TODO: 바뀐 데이터를 상위 요소에게 알려줘야 함
    },
  ]);

  setCardState(cardElement, cardData, cardMode.getState());

  return card;
};

/**
 *
 * @param {HTMLElement} cardElement
 * @param {Card} cardData
 * @param {CardMode} mode
 */
const setCardState = (cardElement, cardData, mode) => {
  toggleDisplay(
    cardElement.querySelector('#freezed-text'),
    mode.currentMode !== 'add'
  );
  toggleDisplay(
    cardElement.querySelector('#icon-area'),
    mode.currentMode !== 'add'
  );
  toggleDisplay(
    cardElement.querySelector('#text-form'),
    mode.currentMode === 'add'
  );
  toggleDisplay(
    cardElement.querySelector('#button-area'),
    mode.currentMode === 'add'
  );

  toggleDisplay(cardElement.querySelector('#add-button'), !mode.isEditMode);
  toggleDisplay(cardElement.querySelector('#edit-button'), mode.isEditMode);

  cardElement
    .querySelectorAll('#button-area button')
    .forEach((button, index) => {
      if (index !== 0) {
        button.disabled = cardData.title === null || cardData.body === null;
      }
    });

  const _h3 = cardElement.querySelector('h3');
  const _p = cardElement.querySelector('p');
  const _input = cardElement.querySelector('form input');
  const _textArea = cardElement.querySelector('form textarea');

  _input.value = _h3.textContent = cardData.title;
  _textArea.value = _p.textContent = cardData.body;

  setCardShadow(cardElement, mode);

  if (mode == 'place') {
    cardElement.style.opacity = '0.3';
  } else {
    cardElement.style.opacity = '1';
  }
};

const applyCardChanges = (cardElement, cardState) => {
  cardState.setState({
    ...cardState.getState(),
    title: cardElement.querySelector('input').value,
    body: cardElement.querySelector('textarea').value,
  });
};

export default Card;
