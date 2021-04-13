import 'regenerator-runtime/runtime';
import { sentence } from 'txtgen';
import { Dogeify } from './dogeify';

const DOGE_WIDTH = 500;
const DOGE_HEIGHT = 500;
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function debounce(f, ms) {
    let isCooldown = false;
    return function() {
        if (isCooldown) return;
        f.apply(this, arguments);
        isCooldown = true;
        setTimeout(() => isCooldown = false, ms);
    };
}

const placePhrases = () => {
    const {width, height} = document.body.getClientRects()[0];
    const amount = width > 900 ? 4 : 2;
    Promise.all(Array.from({length: amount}).map(() => new Dogeify().init(sentence())))
        .then((sentencies) => {
            const container = document.createDocumentFragment()
            sentencies.flatMap((text) => text.split('. '))
                .forEach((phrase) => {
                    const phraseNode = document.createElement('span');
                    phraseNode.className = 'phrase';
                    phraseNode.style.left = `${rand(0, width - 50)}px`
                    phraseNode.style.top = `${rand(0, height - 50)}px`;
                    phraseNode.innerText = phrase;
                    container.appendChild(phraseNode);
                });
            document.body.append(container);
        });
};

const positionDoge = () => {
    const {width, height} = document.body.getClientRects()[0];
    const dogeEl = document.querySelector('#doge-container');
    dogeEl.style.left = `${rand(0, width - DOGE_WIDTH)}px`;
    dogeEl.style.top = `${rand(0, height - DOGE_HEIGHT)}px`;
};

const initBg = () => {
    document.body.style.backgroundImage = `url("https://picsum.photos/1980/1024?rand=${Math.random()}")`;
};

const clearPhrases = () => {
    document.querySelectorAll('.phrase').forEach((element) => {
        element.remove();
    });
};

const init = () => {
    initBg();
    positionDoge();
    clearPhrases();
    placePhrases();
}

window.addEventListener('click', init);
window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', debounce(init, 1000));
