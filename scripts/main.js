import Column from './components/column.js';
import { updateColumn, loadTodos } from './utils/helpers/localStorageHelper.js';

const App = () => {
  const main = document.querySelector('main');
  console.log(loadTodos());

  let isDragging = false;

  const addMouseDownEvent = (cardElement) => {
    cardElement.addEventListener('mousedown', (e) => {
      isDragging = false;
      cardElement.addEventListener('mousemove', handleMouseMove);
    })
  }

  const addMouseUpEvent = (cardElement) => {
    cardElement.addEventListener('mouseUp', (e) => {
      console.log('ㄷㄷ');
      cardElement.removeEventListener('mousemove', handleMouseMove);
      if (!isDragging) {
        console.log('click!');
      }
    })
  }

  const handleMouseMove = (e) => {
    isDragging = true;
    // 마우스 좌표 출력
    console.log('dragging!', e.clientX, e.clientY);
  }

  loadTodos().forEach((column) => {
    main.appendChild(Column(column, (cardElement) => {
      addMouseDownEvent(cardElement);
      addMouseUpEvent(cardElement);
    }));
  });

  document.querySelector('#history').addEventListener('click', (e) => {
    console.log('view archived columns');
  });
  document.querySelector('header div button').addEventListener('click', (e) => {
    console.log('convert to sort mode');
  });
};

App();
