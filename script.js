document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const s = document.getElementById('L-S');
    const o = document.getElementById('L-O');
    const k = document.getElementById('L-K');
    const r = document.getElementById('L-R');
    const i = document.getElementById('L-I');
    const connector = document.getElementById('conn-and');
    const subtitle = document.querySelector('.subtitle');
    const whiteOverlay = document.querySelector('.white-overlay');

    const wrappers = [s, o, k, r, i];

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    const initialGap = 80;
    const verticalGap = 100;

    // targetX is where the stack is aligned (Initial S position)
    const startHorizontalX = cx - (2 * initialGap);
    const targetX = startHorizontalX;

    let isSkipped = false;
    let sequenceFinished = false;
    let exitTriggered = false;

    // 1. SETUP & APPEAR (Horizontal)
    const setupAndAppear = () => {
        wrappers.forEach((el, index) => {
            el.style.transition = 'none';
            const x = startHorizontalX + (index * initialGap);
            el.style.left = `${x}px`;
            el.style.top = `${cy}px`;
            el.style.transform = 'translate(-50%, -50%)';
            el.style.opacity = '1';
            void el.offsetHeight;

            setTimeout(() => {
                if (!isSkipped) el.style.transition = 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
            }, 100);

            const letter = el.querySelector('.letter');
            letter.classList.add('wave');
            letter.style.animationDelay = `${index * 0.2}s`;
        });

        if (connector) {
            connector.style.transition = 'none';
            connector.style.opacity = '0';
            connector.style.left = `${cx}px`;
            connector.style.top = `${cy}px`;
            void connector.offsetHeight;
            setTimeout(() => {
                if (!isSkipped) connector.style.transition = 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
            }, 100);
        }
    };

    setupAndAppear();

    // 2. MAIN SEQUENCE -> SCATTER VERTICAL
    const runSequence = async () => {
        if (isSkipped) return;
        await wait(1000);
        if (isSkipped) return;

        // SCATTER: Vertical Stack anchored at targetX
        // Scaled down to 70% (Gap: 100 -> 70)
        const activeVerticalGap = 70;
        wrappers.forEach((el, index) => {
            const stepsFromR = index - 3; // -3(S), -2(O), -1(K), 0(R), 1(I)
            const targetY = cy + (stepsFromR * activeVerticalGap);

            el.style.transform = 'translate(0, -50%)'; // Left Align expansion
            el.style.left = `${targetX}px`; // Align to S's initial X
            el.style.top = `${targetY}px`;

            // 70% Font Scale (5rem -> 3.5rem)
            el.style.fontSize = '3.5rem';
            const exp = el.querySelector('.expansion');
            if (exp) {
                exp.style.fontSize = '2.1rem'; // 3rem -> 2.1rem
                exp.style.marginLeft = '0.84rem'; // 1.2rem -> 0.84rem
                exp.style.letterSpacing = '0.84rem'; // 1.2rem -> 0.84rem
            }
        });

        if (connector) {
            // Connector (and) is horizontally aligned with I
            const iY = (cy + activeVerticalGap) - 6; // Scaled offset
            connector.style.transform = 'translate(0, -50%)';
            connector.style.top = `${iY}px`;
            connector.style.left = `${targetX - 35}px`; // Scaled offset
            connector.style.fontSize = '1.05rem'; // 1.5rem -> 1.05rem
        }

        await wait(1500);
        if (isSkipped) return;

        // TYPING (Top-Down)
        const typeSpeed = 50;

        await typeChars(s.querySelector('.expansion'), "chool", typeSpeed);
        if (isSkipped) return;
        await wait(200);


        await typeChars(o.querySelector('.expansion'), "f", typeSpeed);
        if (isSkipped) return;

        await wait(300);

        await typeChars(k.querySelector('.expansion'), "nowledge,", typeSpeed);
        if (isSkipped) return;

        await typeChars(r.querySelector('.expansion'), "eason,", typeSpeed);
        if (isSkipped) return;

        // coordinated "And" pushing "I" with skew trigger on 'd'
        if (connector) {
            connector.style.opacity = '1';
            const finalMove = 30; // Scaled move
            await typeChars(connector, "And", typeSpeed, (charIndex) => {
                connector.innerHTML = '<span class="wave">A</span>nd';
                if (charIndex === 1) { // "n"
                    // "And가 생기고 I가 이탤릭체가 될 때 And문자열이 전체가 왼쪽으로... 반동으로 튕기듯이"
                    i.querySelector('.letter').style.transform = 'skewX(-15deg)';
                    i.style.left = `${targetX + finalMove}px`;

                    // Recoil Bounce (Slower)
                    connector.style.transition = 'left 0.1s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
                    connector.style.left = `${targetX - 25}px`; // Scaled recoil
                }
            });

            // Wrap "A" with wave class after typing is complete

        }
        if (isSkipped) return;

        // "nquiry는 이탤릭체 적용하지마" -> Expansion is already upright.
        await typeChars(i.querySelector('.expansion'), "nquiry", typeSpeed);
        if (isSkipped) return;

        showSubtitle();
        sequenceFinished = true;
    };

    const showSubtitle = () => {
        const activeVerticalGap = 70;
        if (subtitle) {
            subtitle.style.position = 'absolute';
            // Below I (cy + verticalGap) + gap
            subtitle.style.top = `${cy + (2 * activeVerticalGap) + 10}px`;
            subtitle.style.left = `${cx}px`;
            subtitle.style.transform = 'translate(-50%, -50%)';
            subtitle.style.fontSize = '2.1rem'; // 3rem -> 2.1rem
            subtitle.classList.add('visible');
        }

        const subMain = document.querySelector('.subtitle-secondary');
        if (subMain) {
            subMain.style.top = `${cy + (2 * activeVerticalGap) + 70}px`;
            subMain.style.left = `${cx}px`;
            subMain.style.transform = 'translate(-50%, -50%)';
            subMain.style.fontSize = '0.84rem'; // 1.2rem -> 0.84rem
            subMain.classList.add('visible');
        }
    };

    const triggerExit = async () => {
        if (exitTriggered) return;
        exitTriggered = true;

        // Brighten SOKRI Initial letters
        wrappers.forEach(el => {
            const letter = el.querySelector('.letter');
            letter.style.filter = "brightness(2.5) drop-shadow(0 0 15px #fff)";
            letter.style.transition = "filter 1s ease";

            const exp = el.querySelector('.expansion');
            if (exp) {
                exp.style.filter = "brightness(2.5)";
                exp.style.transition = "filter 1s ease";
            }
        });

        // Brighten Connector
        if (connector) {
            connector.style.filter = "brightness(2.5)";
            connector.style.transition = "filter 1s ease";

            // Specifically brighten the "A" even more
            const aLetter = connector.querySelector('.wave');
            if (aLetter) {
                aLetter.style.filter = "brightness(3) drop-shadow(0 0 20px #fff)";
                aLetter.style.transition = "filter 1s ease";
            }
        }

        if (subtitle) {
            subtitle.classList.add('brighten');
        }

        const subMain = document.querySelector('.subtitle-secondary');
        if (subMain) {
            subMain.classList.add('brighten');
        }

        await wait(1500);

        if (whiteOverlay) whiteOverlay.classList.add('active');
    };

    window.addEventListener('click', () => {
        document.body.classList.add('door-open');
        if (exitTriggered) return;

        if (!sequenceFinished) {
            isSkipped = true;
            sequenceFinished = true;

            const activeVerticalGap = 70;
            const finalIMove = 30;
            // Force Vertical Positions (Anchored at R)
            wrappers.forEach((el, index) => {
                const stepsFromR = index - 3;
                const targetY = cy + (stepsFromR * activeVerticalGap);

                el.style.transition = 'none';
                el.style.transform = 'translate(0, -50%)';
                el.style.left = (index === 4) ? `${targetX + finalIMove}px` : `${targetX}px`;
                el.style.top = `${targetY}px`;
                el.style.opacity = '1';

                // Scale fonts in skip state
                el.style.fontSize = '3.5rem';

                const exp = el.querySelector('.expansion');
                exp.style.width = 'auto';
                exp.style.opacity = '1';
                exp.style.fontSize = '2.1rem';
                exp.style.marginLeft = '0.84rem';
                exp.style.letterSpacing = '0.84rem';
                exp.classList.remove('typing-cursor');

                const letter = el.querySelector('.letter');
                if (el.id == 'L-S') exp.textContent = 'chool';
                if (el.id == 'L-O') exp.textContent = 'f';
                if (el.id == 'L-K') exp.textContent = 'nowledge,';
                if (el.id == 'L-R') exp.textContent = 'eason,';
                if (el.id == 'L-I') {
                    exp.textContent = 'nquiry';
                    letter.style.transform = 'skewX(-15deg)';
                    letter.style.left = `${targetX + 50}px`;
                } else {
                    letter.style.transform = 'none';
                }
            });

            if (connector) {
                const iY = (cy + activeVerticalGap) - 7;
                connector.style.transition = 'none';
                connector.style.transform = 'translate(0, -50%)';
                connector.style.top = `${iY}px`;
                connector.style.left = `${targetX - 25}px`; // Recoil position
                connector.style.opacity = '1';
                connector.style.fontSize = '1.05rem';
                connector.innerHTML = '<span class="wave" style="animation-delay: 0s">A</span>nd';
                connector.classList.remove('typing-cursor');
            }

            showSubtitle();
        }

        triggerExit();
    });

    /**
     * @param {HTMLElement} element 
     * @param {string} text 
     * @param {number} speed 
     * @param {Function} [onChar] Callback called per character typed
     */
    function typeChars(element, text, speed, onChar) {
        return new Promise(resolve => {
            if (isSkipped) { resolve(); return; }
            element.textContent = "";
            element.style.width = 'auto';
            element.style.opacity = '1';

            let charIndex = 0;
            element.classList.add('typing-cursor');

            const interval = setInterval(() => {
                if (isSkipped) {
                    clearInterval(interval);
                    resolve();
                    return;
                }

                element.textContent += text.charAt(charIndex);
                if (onChar) onChar(charIndex);

                charIndex++;
                if (charIndex >= text.length) {
                    clearInterval(interval);
                    element.classList.remove('typing-cursor');
                    resolve();
                }
            }, speed);
        });
    }

    runSequence();
});
