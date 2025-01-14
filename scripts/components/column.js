import { createCard } from '../utils/helpers/cardHelper.js';
import { updateColumn } from '../utils/helpers/localStorageHelper.js';
import createState from '../utils/helpers/stateHelper.js';
import Card from './card.js';
/**
 * @typedef {Object} Card
 * @property {number} id - 카드 ID
 * @property {string} title - 카드 제목
 * @property {string} body - 카드 내용
 * @property {string} createdDate - 카드 생성일
 */

/**
 * @typedef {Object} Column
 * @property {number} columnId - 컬럼 ID
 * @property {string} columnName - 컬럼 이름
 * @property {Card[]} cards - 카드 배열
 */

/**
 * 컬럼 컴포넌트
 * @param {Column} columnData - 컬럼 데이터
 * @param {function} addMouseEvent - 카드 드래그 관련 이벤트 추가 함수
 */
const Column = (columnData, addMouseEvent) => {
  const column = document
    .getElementById('column-template')
    .content.cloneNode(true);

  /**
   * @type {HTMLElement}
   */
  const columnElement = column.querySelector('ul');

  const columnState = createState(columnData);
  columnState.subscribe(() => {
    // TODO: 바뀐 데이터를 로컬스토리지나 서버에 저장해야함
    updateColumn(columnState.getState());
    columnElement.querySelector('.textlabel').textContent =
      columnState.getState().cards.length;
  });

  columnElement.querySelector('h2').textContent = columnData.columnName;
  columnElement.querySelector('.textlabel').textContent =
    columnState.getState().cards.length;

  columnData.cards.forEach((cardData) => {
    const cardElement = createCard('default', cardData, columnState);
    addMouseEvent(cardElement.querySelector('li'));
    columnElement.appendChild(cardElement);
  });

  columnElement.querySelector('#add-card').addEventListener('click', (e) => {
    const newCard = createCard(
      'add',
      {
        id: null,
        title: null,
        body: null,
        createdDate: null,
      },
      columnState
    );

    const firstChild = columnElement.querySelector('li'); // 첫 번째 자식 요소 선택
    if (firstChild) {
      columnElement.insertBefore(newCard, firstChild);
    } else {
      columnElement.appendChild(newCard);
    }

    columnElement.querySelector('#add-card').disabled = true;
  });

  columnElement
    .querySelector('#close-column')
    .addEventListener('click', (e) => {
      columnElement.remove();
      // TODO: 상위 요소에게 컬럼 삭제 이벤트 전달
    });

  return column;
};

export default Column;
