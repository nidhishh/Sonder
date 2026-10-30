(function () {
    'use strict';

    /* ==========================================================================
       1. APPLICATION STATE & PRODUCT DATA (FROM SONDER_V2.PDF)
       ========================================================================== */
    var state = {
        stage: 1,
        persona: 'ananya', // 'ananya' | 'rohan'
        tier: 'free',      // 'free' | 'plus' | 'priority'
        tokens: 3,
        audioOn: true,
        partnerWillHeart: true,
        userHearted: false,
        userExtended: false,
        partnerExtended: false,
        muted: false,
        callSecondsLeft: 180,
        callSecondsElapsed: 0,
        callInterval: null,
        queueWaitSec: 18,
        webcamActive: false,
        webcamStream: null,
        webcamVideo: null,
        lastOutcome: 'mutual', // 'mutual' | 'onesided' | 'early_hangup' | 'reported'
        icebreakerIndex: 0,
        metrics: {
            callsPerWeek: 6.0,
            completionPct: 60,
            mutualRatePct: 40,
            womenWaitSec: 18,
            reportsPer1k: 1.2
        }
    };

    var PERSONAS = {
        ananya: {
            label: 'ANANYA · 26 · BLR',
            selfCallTitle: 'You (Ananya, 26)',
            waitSec: 18,
            queueRank: '#1 PRIORITY',
            fomoText: 'BENGALURU LIVE HOUR · 312 CALLERS · WOMEN PRIORITY WAIT: 18s',
            selfColor: '#39ff88',
            peerName: 'Kabir, 28 · Bengaluru',
            peerShort: 'Kabir, 28',
            peerShared: 'Verified ID · Indiranagar · Travel, Music',
            peerColor: '#ff5a36',
            bubLeft: 'zero fake profiles!',
            bubRight: '18s priority queue'
        },
        rohan: {
            label: 'ROHAN · 27 · MUM',
            selfCallTitle: 'You (Rohan, 27)',
            waitSec: 38,
            queueRank: '#4 IN QUEUE',
            fomoText: 'BENGALURU LIVE HOUR · 312 CALLERS · EST. QUEUE WAIT: 38s',
            selfColor: '#2bd9ff',
            peerName: 'Priya, 26 · Bengaluru',
            peerShort: 'Priya, 26',
            peerShared: 'Verified ID · Koramangala · Travel, Music',
            peerColor: '#ff2bd6',
            bubLeft: 'be heard in 3 min!',
            bubRight: 'no dead openers'
        }
    };

    var STAGE_COPY = {
        1: {
            headline: 'Hear the vibe before a week of texting.',
            subcopy: 'Screen 1 of 5 (MVP): Curiosity lock badge builds FOMO before the Live tab opens; zero unverified browsing.',
            darkPhone: false
        },
        2: {
            headline: 'Trust before talk: AI face & lighting scan.',
            subcopy: 'Screen 2 of 5 (MVP): Quiet pre-call liveness & lighting check verifies every caller before entering the queue.',
            darkPhone: false
        },
        3: {
            headline: 'Make the wait fair: shared-interest queue.',
            subcopy: 'Screen 3 of 5 (MVP): Concentrated 9–11 PM Live Hours keep median wait under 40s with transparent queue position.',
            darkPhone: true
        },
        4: {
            headline: 'Keep stakes low: 3-minute voice-first call.',
            subcopy: 'Screen 4 of 5 (MVP): Omegle-style split screen, rotating icebreaker prompt, and mutual +3m extension.',
            darkPhone: true
        },
        5: {
            headline: 'No swipe screen: mutual heart unlocks chat.',
            subcopy: 'Screen 5 of 5 (MVP): Both tapped heart opens chat immediately; one-sided hearts stay 100% invisible.',
            darkPhone: true
        },
        6: {
            headline: 'Plan the first date & train the match engine.',
            subcopy: 'Step 5 & 6 of Core Loop: Unlocked chat seeded with your call icebreaker + 1-tap post-call chemistry rating.',
            darkPhone: true
        }
    };

    var ICEBREAKERS = [
        {
            q: 'Most unpopular food opinion?',
            reply: '"Wait, pineapple on biryani is a crime—tell me your real take!"'
        },
        {
            q: 'Two truths and a lie. Go.',
            reply: '"Okay: I once missed a flight for dosa, I hate monsoon traffic, and I can parallel park."'
        },
        {
            q: 'Pitch your ideal Sunday in Bengaluru in 10 seconds.',
            reply: '"Morning run at Cubbon Park, filter coffee in Indiranagar, and zero work emails."'
        },
        {
            q: 'What is a green flag you notice in the first 60 seconds?',
            reply: '"When someone laughs at their own terrible joke without holding back."'
        },
        {
            q: 'Worst first-date story, unfiltered.',
            reply: '"He brought a spreadsheet of 5-year career goals to a coffee date. Never again!"'
        },
        {
            q: 'Which song is stuck in your head right now?',
            reply: '"Late-night indie Hindi playlist on repeat since 9 PM."'
        }
    ];

    /* ==========================================================================
       2. RETRO WEBAUDIO SYNTHESIZER (8-BIT CHIPTUNE BLEEPS)
       ========================================================================== */
    var audioCtx = null;

    function playSound(type) {
        if (!state.audioOn) return;
        try {
            if (!audioCtx) {
                var AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) return;
                audioCtx = new AudioContextClass();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            var now = audioCtx.currentTime;
            var notes = {
                click: [[520, 0.05, 'square']],
                scan: [[440, 0.07, 'square'], [587, 0.07, 'square'], [880, 0.12, 'square']],
                queue: [[523, 0.08, 'triangle'], [659, 0.08, 'triangle'], [784, 0.14, 'triangle']],
                heart: [[659, 0.08, 'sine'], [880, 0.16, 'triangle']],
                extend: [[440, 0.06, 'square'], [554, 0.06, 'square'], [659, 0.06, 'square'], [880, 0.14, 'square']],
                match: [[523, 0.08, 'square'], [659, 0.08, 'square'], [784, 0.08, 'square'], [1046, 0.22, 'square']],
                refund: [[660, 0.07, 'triangle'], [520, 0.11, 'triangle']],
                report: [[240, 0.12, 'sawtooth'], [180, 0.18, 'sawtooth']]
            }[type] || [[440, 0.05, 'square']];

            var offset = 0;
            notes.forEach(function (n) {
                var osc = audioCtx.createOscillator();
                var gain = audioCtx.createGain();
                osc.type = n[2];
                osc.frequency.setValueAtTime(n[0], now + offset);
                gain.gain.setValueAtTime(0.06, now + offset);
                gain.gain.exponentialRampToValueAtTime(0.001, now + offset + n[1]);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now + offset);
                osc.stop(now + offset + n[1]);
                offset += n[1] * 0.9;
            });
        } catch (e) {
            // Ignore audio errors if blocked by browser autoplay policy
        }
    }

    /* ==========================================================================
       3. PROCEDURAL PIXEL ART SPRITE ENGINE (8x8, 16x16, 32x32 CANVASES)
       ========================================================================== */
    var N16 = 16;
    function makeGrid16(rows, topOffset) {
        var g = new Array(256).fill(0);
        rows.forEach(function (r, y) {
            for (var x = 0; x < N16; x++) {
                if (r[x] === '#') g[(y + (topOffset || 0)) * N16 + x] = 1;
            }
        });
        return g;
    }

    var SPRITE_LOCK = makeGrid16([
        ".....######.....",
        "....########....",
        "...###....###...",
        "...##......##...",
        "...##......##...",
        "..############..",
        ".##############.",
        ".##############.",
        ".######..######.",
        ".######..######.",
        ".######..######.",
        ".##############.",
        "..############.."
    ], 1);

    var SPRITE_SHIELD = makeGrid16([
        ".......##.......",
        "....########....",
        "..############..",
        ".##############.",
        ".##############.",
        ".##########..##.",
        ".#########..###.",
        ".###..###..####.",
        "..###..#..####..",
        "...###...####...",
        "....########....",
        ".....######.....",
        "......####......",
        ".......##......."
    ], 1);

    var SPRITE_RADAR = makeGrid16([
        "....########....",
        "..############..",
        ".###........###.",
        "###...####...###",
        "##...######...##",
        "##..##....##..##",
        "##..#..##..#..##",
        "##..#..##..#..##",
        "##..##....##..##",
        "##...######...##",
        "###...####...###",
        ".###........###.",
        "..############..",
        "....########...."
    ], 1);

    var SPRITE_HEART = makeGrid16([
        "..####....####..",
        ".######..######.",
        "################",
        "################",
        "################",
        ".##############.",
        "..############..",
        "...##########...",
        "....########....",
        ".....######.....",
        "......####......",
        ".......##......."
    ], 2);

    var SPRITE_CHAT = makeGrid16([
        "..############..",
        ".##############.",
        "###..........###",
        "###..######..###",
        "###..........###",
        "###..####....###",
        ".##############.",
        "..############..",
        "....####........",
        "...###..........",
        "..##............"
    ], 2);

    var STAGE_SPRITES = [
        SPRITE_LOCK,
        SPRITE_LOCK,
        SPRITE_SHIELD,
        SPRITE_RADAR,
        SPRITE_HEART,
        SPRITE_HEART,
        SPRITE_CHAT
    ];

    function drawGrid16(canvasId, grid, fgColor, accentColor) {
        var cv = document.getElementById(canvasId);
        if (!cv) return;
        var ctx = cv.getContext('2d');
        ctx.clearRect(0, 0, 16, 16);
        for (var i = 0; i < 256; i++) {
            if (grid[i]) {
                var x = i % 16;
                var y = Math.floor(i / 16);
                ctx.fillStyle = (accentColor && (y + x) % 5 === 0) ? accentColor : fgColor;
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }

    var FACE_8X8 = [
        "..####..",
        ".######.",
        "##.##.##",
        "########",
        "#.####.#",
        "##....##",
        ".######.",
        "..####.."
    ];

    function drawAvatar8(canvasId, mainColor, eyeColor) {
        var cv = document.getElementById(canvasId);
        if (!cv) return;
        var ctx = cv.getContext('2d');
        ctx.clearRect(0, 0, 8, 8);
        FACE_8X8.forEach(function (row, y) {
            for (var x = 0; x < 8; x++) {
                if (row[x] === '#') {
                    ctx.fillStyle = mainColor;
                    ctx.fillRect(x, y, 1, 1);
                } else if (y === 2 && (x === 2 || x === 5)) {
                    ctx.fillStyle = eyeColor || '#ffe600';
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        });
    }

    function drawMatchCanvas(outcome) {
        var cv = document.getElementById('match-canvas');
        if (!cv) return;
        var ctx = cv.getContext('2d');
        ctx.clearRect(0, 0, 16, 16);
        if (outcome === 'mutual') {
            drawGrid16('match-canvas', SPRITE_HEART, '#ff5a36', '#ffe600');
        } else {
            drawGrid16('match-canvas', SPRITE_RADAR, '#2bd9ff', '#ffe600');
        }
    }

    /* Animated 32x32 Liveness Camera Canvas (or Local 32x32 Pixelated Webcam) */
    function renderCamFrame(ts) {
        var cv = document.getElementById('cam-canvas');
        if (!cv) return;
        var ctx = cv.getContext('2d');

        if (state.webcamActive && state.webcamVideo && state.webcamVideo.readyState >= 2) {
            ctx.drawImage(state.webcamVideo, 0, 0, 32, 32);
        } else {
            ctx.fillStyle = '#120624';
            ctx.fillRect(0, 0, 32, 32);
            var p = PERSONAS[state.persona];
            var bob = Math.round(Math.sin(ts / 350));
            // Draw stylized 32x32 pixel portrait
            ctx.fillStyle = p.selfColor;
            ctx.fillRect(9, 7 + bob, 14, 15);
            ctx.fillRect(7, 10 + bob, 18, 10);
            // Eyes (blink every 3s)
            var blink = (Math.floor(ts / 160) % 18 === 0);
            ctx.fillStyle = '#120624';
            ctx.fillRect(11, 12 + bob, 3, blink ? 1 : 3);
            ctx.fillRect(18, 12 + bob, 3, blink ? 1 : 3);
            // Smile
            ctx.fillRect(12, 18 + bob, 8, 2);
            ctx.fillRect(11, 17 + bob, 2, 1);
            ctx.fillRect(19, 17 + bob, 2, 1);
            // Shoulders
            ctx.fillStyle = '#ffe600';
            ctx.fillRect(6, 23, 20, 7);
        }

        // Corner targeting brackets
        ctx.fillStyle = '#39ff88';
        ctx.fillRect(2, 2, 5, 1);
        ctx.fillRect(2, 2, 1, 5);
        ctx.fillRect(25, 2, 5, 1);
        ctx.fillRect(29, 2, 1, 5);
        ctx.fillRect(2, 29, 5, 1);
        ctx.fillRect(2, 25, 1, 5);
        ctx.fillRect(25, 29, 5, 1);
        ctx.fillRect(29, 25, 1, 5);
    }

    /* Background Morphing 16x16 Sprite Loop */
    var bgCurrentStage = 1;
    var bgNoise = [];
    for (var k = 0; k < 256; k++) bgNoise.push(Math.random());

    function animateSprites(ts) {
        bgCurrentStage += (state.stage - bgCurrentStage) * 0.1;
        var idx = Math.max(1, Math.min(5, Math.floor(bgCurrentStage)));
        var frac = bgCurrentStage - idx;
        var spriteA = STAGE_SPRITES[idx] || SPRITE_HEART;
        var spriteB = STAGE_SPRITES[idx + 1] || SPRITE_HEART;

        var bgCv = document.getElementById('bg-sprite');
        if (bgCv) {
            var bctx = bgCv.getContext('2d');
            bctx.clearRect(0, 0, 16, 16);
            bctx.fillStyle = (state.stage >= 3 && state.stage <= 4) ? '#ffe600' : '#2b0a00';
            for (var i = 0; i < 256; i++) {
                var on = frac > bgNoise[i] ? spriteB[i] : spriteA[i];
                if (on) {
                    bctx.fillRect(i % 16, Math.floor(i / 16), 1, 1);
                }
            }
        }

        if (state.stage === 2) {
            renderCamFrame(ts);
        }
        requestAnimationFrame(animateSprites);
    }

    /* ==========================================================================
       4. TELEMETRY EVENT LOGGER & NORTH STAR CALCULATOR (SLIDE 6 & 8 SPEC)
       ========================================================================== */
    function logEvent(eventName, detailObj) {
        var logContainer = document.getElementById('event-log');
        if (!logContainer) return;

        var now = new Date();
        var hh = ('0' + now.getHours()).slice(-2);
        var mm = ('0' + now.getMinutes()).slice(-2);
        var ss = ('0' + now.getSeconds()).slice(-2);

        var row = document.createElement('div');
        row.className = 'log-entry';

        var detailStr = Object.keys(detailObj || {}).map(function (key) {
            return key + '=' + detailObj[key];
        }).join(' · ');

        row.innerHTML =
            '<span class="log-time">[' + hh + ':' + mm + ':' + ss + ']</span>' +
            '<span class="log-name">' + eventName + '</span>' +
            '<span>' + detailStr + '</span>';

        logContainer.insertBefore(row, logContainer.firstChild);
    }

    function updateTelemetryHUD() {
        var ns = (
            state.metrics.callsPerWeek *
            (state.metrics.completionPct / 100) *
            (state.metrics.mutualRatePct / 100)
        ).toFixed(2);

        document.getElementById('ns-total').textContent = ns;
        document.getElementById('ns-calls').textContent = state.metrics.callsPerWeek.toFixed(1);
        document.getElementById('ns-comp').textContent = state.metrics.completionPct + '%';
        document.getElementById('ns-rate').textContent = state.metrics.mutualRatePct + '%';

        document.getElementById('gr-wait').textContent = state.metrics.womenWaitSec + 's PASS';
        document.getElementById('gr-reports').textContent = state.metrics.reportsPer1k.toFixed(1) + ' PASS';
        document.getElementById('gr-comp').textContent = state.metrics.completionPct + '% PASS';
    }

    /* ==========================================================================
       5. STAGE NAVIGATION & SCREEN SYNCHRONIZATION
       ========================================================================== */
    function syncPersonaAndTierUI() {
        var p = PERSONAS[state.persona];
        document.getElementById('phone-persona-label').textContent = p.label;
        document.getElementById('fomo-strip-text').textContent = p.fomoText;
        document.getElementById('bub-left').textContent = p.bubLeft;
        document.getElementById('bub-right').textContent = p.bubRight;

        // Queue wait & rank
        var effectiveWait = state.tier === 'priority' ? 14 : p.waitSec;
        state.queueWaitSec = effectiveWait;
        document.getElementById('queue-rank-pill').textContent =
            (state.persona === 'ananya' || state.tier === 'priority') ? '#1 PRIORITY' : p.queueRank;
        document.getElementById('queue-wait-label').textContent =
            'Estimated wait: ' + effectiveWait + ' sec';

        // Call screen labels
        document.getElementById('peer-name').textContent = p.peerName;
        document.getElementById('peer-shared').textContent = p.peerShared;
        document.getElementById('self-call-name').textContent = p.selfCallTitle;
        document.getElementById('chat-peer-header').textContent = p.peerShort;

        // Redraw 8x8 caller avatars
        drawAvatar8('peer-avatar', p.peerColor, '#ffe600');
        drawAvatar8('self-avatar', p.selfColor, '#12060b');

        // Tier badges
        var tierNames = { free: 'FREE', plus: 'PLUS ₹499', priority: 'PRIORITY ₹799' };
        var tokenText = state.tier === 'free' ? (state.tokens + '/3 CALLS') : 'UNLIMITED';
        document.getElementById('top-tier-label').textContent = tierNames[state.tier] + ' · ' + tokenText;
        document.getElementById('token-count-text').textContent =
            state.tier === 'free' ? (state.tokens + ' TOKENS') : 'UNLIMITED';
        document.getElementById('active-tier-pill').textContent = tierNames[state.tier];

        // Sync console active buttons
        document.getElementById('btn-persona-ananya').classList.toggle('active', state.persona === 'ananya');
        document.getElementById('btn-persona-rohan').classList.toggle('active', state.persona === 'rohan');

        document.querySelectorAll('[data-tier]').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-tier') === state.tier);
        });
    }

    function formatTimer(sec) {
        var m = Math.floor(sec / 60);
        var s = sec % 60;
        return ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
    }

    function stopCallClock() {
        if (state.callInterval) {
            clearInterval(state.callInterval);
            state.callInterval = null;
        }
    }

    function startCallSession() {
        stopCallClock();
        state.callSecondsLeft = 180;
        state.callSecondsElapsed = 0;
        state.userHearted = false;
        state.userExtended = false;
        state.partnerExtended = false;
        state.muted = false;

        if (state.tier === 'free' && state.tokens > 0) {
            state.tokens--;
        }
        syncPersonaAndTierUI();

        document.getElementById('call-timer').textContent = formatTimer(state.callSecondsLeft);
        document.getElementById('call-elapsed-pill').textContent = '0s ELAPSED (<30s SAFE EXIT)';
        document.getElementById('btn-heart').classList.remove('active');
        document.getElementById('heart-label').textContent = 'Vibe';
        document.getElementById('btn-extend').classList.remove('active');
        document.getElementById('extend-label').textContent = 'Extend +3';
        document.getElementById('mute-label').textContent = 'Mute';
        document.getElementById('call-status-msg').textContent =
            'Tap Vibe if you feel chemistry. Under 30s hang-up = 0 penalty.';

        var currentIce = ICEBREAKERS[state.icebreakerIndex];
        document.getElementById('ice-question-text').textContent = currentIce.q;
        document.getElementById('peer-voice-line').textContent = currentIce.reply;

        state.callInterval = setInterval(function () {
            if (state.stage !== 4) return;
            if (state.callSecondsLeft > 0) {
                state.callSecondsLeft--;
                state.callSecondsElapsed++;
                document.getElementById('call-timer').textContent = formatTimer(state.callSecondsLeft);
                if (state.callSecondsElapsed < 30) {
                    document.getElementById('call-elapsed-pill').textContent =
                        state.callSecondsElapsed + 's (<30s NO PENALTY)';
                } else {
                    document.getElementById('call-elapsed-pill').textContent =
                        'LIVE · ' + state.callSecondsElapsed + 's ELAPSED';
                }
            } else {
                completeCallAndEvaluate();
            }
        }, 1000);
    }

    function completeCallAndEvaluate() {
        stopCallClock();
        var isMutual = state.userHearted && state.partnerWillHeart;
        state.lastOutcome = isMutual ? 'mutual' : 'onesided';

        logEvent('call_completed', {
            duration_s: state.callSecondsElapsed || 180,
            persona: state.persona,
            extended: state.userExtended && state.partnerExtended
        });

        state.metrics.callsPerWeek = +(state.metrics.callsPerWeek + 0.2).toFixed(1);
        state.metrics.completionPct = Math.min(85, state.metrics.completionPct + 2);

        if (isMutual) {
            state.metrics.mutualRatePct = Math.min(65, state.metrics.mutualRatePct + 3);
            logEvent('mutual_heart', {
                peer: PERSONAS[state.persona].peerShort,
                chat_unlocked: true
            });
            playSound('match');
        } else {
            logEvent('call_wrap_neutral', {
                user_tap: state.userHearted ? 'hidden' : 'none',
                rejection_signal: 'none'
            });
            playSound('queue');
        }

        updateTelemetryHUD();
        goToStage(5, true);
    }

    function renderStage5Outcome() {
        var p = PERSONAS[state.persona];
        var ice = ICEBREAKERS[state.icebreakerIndex];
        drawMatchCanvas(state.lastOutcome);

        if (state.lastOutcome === 'mutual') {
            document.getElementById('match-top-title').textContent = 'Instant Match';
            document.getElementById('match-top-badge').textContent = 'MUTUAL HEART';
            document.getElementById('match-headline').textContent = "It's a match";
            document.getElementById('match-subcopy').textContent =
                'You both tapped the heart — call ended, chat is open.';
            document.getElementById('match-summary-box').innerHTML =
                '<strong>Matched with ' + p.peerName + '</strong><br>' +
                '<span>Verified 3-min voice call · Bonded over: "' + ice.q + '"</span>';
            document.getElementById('btn-open-chat').style.display = 'inline-flex';
        } else if (state.lastOutcome === 'early_hangup') {
            document.getElementById('match-top-title').textContent = 'Early Exit (<30s)';
            document.getElementById('match-top-badge').textContent = 'TOKEN REFUNDED';
            document.getElementById('match-headline').textContent = 'No penalty, re-queued';
            document.getElementById('match-subcopy').textContent =
                'Hang-up under 30s: your free call token was refunded and no heart was asked.';
            document.getElementById('match-summary-box').innerHTML =
                '<strong>Slide 6 Edge Case Verified: Hang-up &lt; 30s</strong><br>' +
                '<span>Zero penalty · Call token restored · Ready for next caller</span>';
            document.getElementById('btn-open-chat').style.display = 'none';
        } else {
            document.getElementById('match-top-title').textContent = 'Call Wrapped';
            document.getElementById('match-top-badge').textContent = 'ZERO REJECTION';
            document.getElementById('match-headline').textContent = 'On to the next vibe';
            document.getElementById('match-subcopy').textContent =
                'One-sided hearts stay 100% invisible—nothing is shown and nobody gets rejected.';
            document.getElementById('match-summary-box').innerHTML =
                '<strong>Slide 6 Edge Case Verified: One-Sided Heart Privacy</strong><br>' +
                '<span>Whether one person tapped or neither tapped, the wrap screen is identical.</span>';
            document.getElementById('btn-open-chat').style.display = 'none';
        }
    }

    function goToStage(stageNum, skipDefaultSound) {
        state.stage = stageNum;
        document.body.setAttribute('data-stage', String(stageNum));

        var cfg = STAGE_COPY[stageNum];
        document.getElementById('stage-headline').textContent = cfg.headline;
        document.getElementById('stage-subcopy').textContent = cfg.subcopy;
        document.getElementById('phone-shell').classList.toggle('dark-screen', cfg.darkPhone);

        // Toggle active screen pane
        for (var i = 1; i <= 6; i++) {
            var pane = document.getElementById('screen-' + i);
            if (pane) pane.classList.toggle('active', i === stageNum);
        }

        // Toggle top stepper buttons
        document.querySelectorAll('.step-btn').forEach(function (btn) {
            btn.classList.toggle('active', Number(btn.getAttribute('data-goto')) === stageNum);
        });

        // Toggle bottom nav tabs
        document.querySelectorAll('.nav-tab').forEach(function (tab) {
            tab.classList.toggle('active', Number(tab.getAttribute('data-goto')) === stageNum);
        });

        // Stage-specific lifecycle hooks & telemetry
        if (stageNum === 1) {
            stopCallClock();
            logEvent('live_tab_view', { persona: state.persona, locked: true });
            if (!skipDefaultSound) playSound('click');
        } else if (stageNum === 2) {
            stopCallClock();
            document.getElementById('scan-status-pill').textContent = 'VERIFIED PASS';
            document.getElementById('chk-3').classList.add('done');
            document.getElementById('chk-3-text').textContent = 'Liveness & lighting check passed';
            logEvent('verify_pass', { mode: state.webcamActive ? 'webcam_32px' : 'sim_32px', pii_stored: false });
            if (!skipDefaultSound) playSound('scan');
        } else if (stageNum === 3) {
            stopCallClock();
            document.getElementById('queue-timeout-alert').classList.remove('visible');
            logEvent('queue_wait_s', {
                est_wait_s: state.queueWaitSec,
                priority: state.persona === 'ananya' || state.tier === 'priority'
            });
            if (!skipDefaultSound) playSound('queue');
        } else if (stageNum === 4) {
            startCallSession();
            if (!skipDefaultSound) playSound('queue');
        } else if (stageNum === 5) {
            stopCallClock();
            renderStage5Outcome();
        } else if (stageNum === 6) {
            stopCallClock();
            logEvent('chat_session_open', { peer: PERSONAS[state.persona].peerShort });
            if (!skipDefaultSound) playSound('click');
        }
    }

    /* ==========================================================================
       6. EVENT LISTENERS & EDGE-CASE LAB WIRING
       ========================================================================== */
    function initEvents() {
        // Initial pixel art draws
        drawGrid16('lock-canvas', SPRITE_LOCK, '#fff0d6', '#ffe600');
        drawGrid16('radar-canvas', SPRITE_RADAR, '#ffe600', '#ff5a36');
        syncPersonaAndTierUI();
        updateTelemetryHUD();
        logEvent('live_tab_view', { persona: state.persona, city: 'Bengaluru_9_11PM' });

        // Top stepper & bottom nav navigation
        document.querySelectorAll('[data-goto]').forEach(function (el) {
            el.addEventListener('click', function () {
                var target = Number(el.getAttribute('data-goto'));
                if (target === 4 && state.stage !== 4) {
                    state.userHearted = true; // default demo convenience
                }
                goToStage(target);
            });
        });

        // Screen 1 -> Screen 2
        document.getElementById('btn-unlock-live').addEventListener('click', function () {
            goToStage(2);
        });

        // Screen 2: Optional 32x32 local webcam toggle
        document.getElementById('btn-toggle-webcam').addEventListener('click', function () {
            var btn = document.getElementById('btn-toggle-webcam');
            if (state.webcamActive) {
                if (state.webcamStream) {
                    state.webcamStream.getTracks().forEach(function (t) { t.stop(); });
                }
                state.webcamActive = false;
                btn.textContent = 'LIVE CAM';
                return;
            }
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: { width: 64, height: 64 }, audio: false })
                    .then(function (stream) {
                        state.webcamStream = stream;
                        var v = document.createElement('video');
                        v.srcObject = stream;
                        v.muted = true;
                        v.playsInline = true;
                        v.play();
                        state.webcamVideo = v;
                        state.webcamActive = true;
                        btn.textContent = 'SIM SPRITE';
                        logEvent('webcam_32px_local', { pii_uploaded: false });
                    })
                    .catch(function () {
                        btn.textContent = 'SIMULATED ONLY';
                    });
            }
        });

        // Screen 2 -> Screen 3
        document.getElementById('btn-enter-queue').addEventListener('click', function () {
            goToStage(3);
        });

        // Screen 3: Toggleable interest chips
        document.querySelectorAll('.filter-chip').forEach(function (chip) {
            chip.addEventListener('click', function () {
                chip.classList.toggle('active');
                playSound('click');
            });
        });

        // Screen 3 -> Screen 4 or Leave Queue
        document.getElementById('btn-connect-call').addEventListener('click', function () {
            goToStage(4);
        });
        document.getElementById('btn-leave-queue').addEventListener('click', function () {
            goToStage(1);
        });

        // Screen 4: Shuffle Icebreaker
        document.getElementById('btn-shuffle-ice').addEventListener('click', function () {
            state.icebreakerIndex = (state.icebreakerIndex + 1) % ICEBREAKERS.length;
            var item = ICEBREAKERS[state.icebreakerIndex];
            document.getElementById('ice-question-text').textContent = item.q;
            document.getElementById('peer-voice-line').textContent = item.reply;
            playSound('click');
            logEvent('icebreaker_shuffle', { prompt: item.q.slice(0, 22) + '...' });
        });

        // Screen 4: Mute button
        document.getElementById('btn-mute').addEventListener('click', function () {
            state.muted = !state.muted;
            document.getElementById('mute-label').textContent = state.muted ? 'Muted' : 'Mute';
            document.getElementById('self-mic-status').textContent = state.muted
                ? 'Mic muted · Tap Mute to speak again'
                : 'Mic live · One-sided hearts stay invisible';
            playSound('click');
        });

        // Screen 4: Heart (Vibe) button
        document.getElementById('btn-heart').addEventListener('click', function () {
            state.userHearted = !state.userHearted;
            var btn = document.getElementById('btn-heart');
            btn.classList.toggle('active', state.userHearted);
            document.getElementById('heart-label').textContent = state.userHearted ? 'Hearted' : 'Vibe';
            document.getElementById('call-status-msg').textContent = state.userHearted
                ? 'Secret heart locked! Kept 100% invisible unless both tap.'
                : 'Heart removed. Tap Vibe anytime before 0:00.';
            playSound('heart');
        });

        // Screen 4: Extend +3 min button
        document.getElementById('btn-extend').addEventListener('click', function () {
            if (state.userExtended) return;
            state.userExtended = true;
            state.partnerExtended = true; // Partner co-signs extension in demo
            state.callSecondsLeft += 180;
            document.getElementById('btn-extend').classList.add('active');
            document.getElementById('extend-label').textContent = '+3m Added';
            document.getElementById('call-timer').textContent = formatTimer(state.callSecondsLeft);
            document.getElementById('call-status-msg').textContent =
                'Both tapped Extend +3! Added 3:00 to the voice call.';
            playSound('extend');
            logEvent('extend_plus_3m', { mutual_tap: true, added_s: 180 });
        });

        // Screen 4: End Call button (checks <30s rule vs full call resolution)
        document.getElementById('btn-end-call').addEventListener('click', function () {
            if (state.callSecondsElapsed < 30 && !state.userHearted) {
                stopCallClock();
                if (state.tier === 'free') {
                    state.tokens = Math.min(3, state.tokens + 1);
                }
                state.lastOutcome = 'early_hangup';
                syncPersonaAndTierUI();
                playSound('refund');
                logEvent('early_hangup_refund', {
                    elapsed_s: state.callSecondsElapsed,
                    penalty: 0,
                    token_refunded: true
                });
                goToStage(5, true);
            } else {
                completeCallAndEvaluate();
            }
        });

        // Screen 4: Report button opens safety dialog
        document.getElementById('btn-report-call').addEventListener('click', function () {
            var dlg = document.getElementById('dialog-report');
            if (dlg && dlg.showModal) dlg.showModal();
        });

        // Screen 5 buttons
        document.getElementById('btn-open-chat').addEventListener('click', function () {
            goToStage(6);
        });
        document.getElementById('btn-requeue-from-match').addEventListener('click', function () {
            goToStage(3);
        });

        // Screen 6: Rating chips & chat form
        document.querySelectorAll('.rate-chip').forEach(function (chip) {
            chip.addEventListener('click', function () {
                document.querySelectorAll('.rate-chip').forEach(function (c) { c.classList.remove('active'); });
                chip.classList.add('active');
                var rating = chip.getAttribute('data-rate');
                playSound('heart');
                logEvent('call_rated', { rating: rating, trains_matching: true });
            });
        });

        function appendChatMessage(text, sender) {
            var chatLog = document.getElementById('chat-log');
            var div = document.createElement('div');
            div.className = 'chat-msg ' + sender;
            div.textContent = text;
            chatLog.appendChild(div);
            chatLog.scrollTop = chatLog.scrollHeight;
        }

        document.querySelectorAll('.quick-reply-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var msg = btn.getAttribute('data-reply');
                appendChatMessage(msg, 'you');
                playSound('click');
                setTimeout(function () {
                    appendChatMessage('Done! Locking it in—way better than texting for 5 days.', 'them');
                    playSound('heart');
                }, 650);
            });
        });

        document.getElementById('chat-form').addEventListener('submit', function (e) {
            e.preventDefault();
            var input = document.getElementById('chat-input');
            var text = input.value.trim();
            if (!text) return;
            appendChatMessage(text, 'you');
            input.value = '';
            playSound('click');
            setTimeout(function () {
                appendChatMessage('Sounds like a plan! See you in Indiranagar.', 'them');
                playSound('heart');
            }, 700);
        });

        /* ======================================================================
           PM DIRECTOR'S CONSOLE CONTROLS (RIGHT PANEL)
           ====================================================================== */
        document.getElementById('btn-audio-toggle').addEventListener('click', function () {
            state.audioOn = !state.audioOn;
            var btn = document.getElementById('btn-audio-toggle');
            btn.textContent = state.audioOn ? 'AUDIO: ON' : 'AUDIO: OFF';
            btn.classList.toggle('active', state.audioOn);
            if (state.audioOn) playSound('click');
        });

        document.getElementById('btn-persona-ananya').addEventListener('click', function () {
            state.persona = 'ananya';
            state.metrics.womenWaitSec = 18;
            syncPersonaAndTierUI();
            updateTelemetryHUD();
            playSound('click');
            logEvent('persona_switch', { persona: 'Ananya_26_BLR', priority_queue: true });
        });

        document.getElementById('btn-persona-rohan').addEventListener('click', function () {
            state.persona = 'rohan';
            syncPersonaAndTierUI();
            updateTelemetryHUD();
            playSound('click');
            logEvent('persona_switch', { persona: 'Rohan_27_MUM', wait_s: 38 });
        });

        document.querySelectorAll('[data-tier]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                state.tier = btn.getAttribute('data-tier');
                if (state.tier !== 'free') state.tokens = 99;
                else state.tokens = 3;
                syncPersonaAndTierUI();
                playSound('extend');
                logEvent('tier_change', { tier: state.tier });
            });
        });

        // Partner Heart Brain Toggle
        document.getElementById('btn-partner-mutual').addEventListener('click', function () {
            state.partnerWillHeart = true;
            document.getElementById('btn-partner-mutual').classList.add('active');
            document.getElementById('btn-partner-onesided').classList.remove('active');
            playSound('heart');
            logEvent('partner_brain_set', { partner_will_heart: true });
        });

        document.getElementById('btn-partner-onesided').addEventListener('click', function () {
            state.partnerWillHeart = false;
            document.getElementById('btn-partner-onesided').classList.add('active');
            document.getElementById('btn-partner-mutual').classList.remove('active');
            playSound('click');
            logEvent('partner_brain_set', { partner_will_heart: false });
        });

        // 4 One-Click Slide 6 Edge Case Triggers
        document.getElementById('edge-early-hangup').addEventListener('click', function () {
            goToStage(4, true);
            state.callSecondsElapsed = 12;
            state.userHearted = false;
            stopCallClock();
            if (state.tier === 'free') state.tokens = Math.min(3, state.tokens + 1);
            state.lastOutcome = 'early_hangup';
            syncPersonaAndTierUI();
            playSound('refund');
            logEvent('early_hangup_refund', { elapsed_s: 12, penalty: 0, token_refunded: true });
            goToStage(5, true);
        });

        document.getElementById('edge-queue-timeout').addEventListener('click', function () {
            goToStage(3, true);
            document.getElementById('queue-timeout-alert').classList.add('visible');
            document.getElementById('queue-wait-label').textContent = 'Wait > 90s · Next Slot Offered';
            playSound('refund');
            logEvent('queue_timeout_90s', { fallback: 'next_live_hour_10pm_priority' });
        });

        document.getElementById('edge-mutual-extend').addEventListener('click', function () {
            if (state.stage !== 4) goToStage(4, true);
            state.userExtended = true;
            state.partnerExtended = true;
            state.callSecondsLeft += 180;
            document.getElementById('btn-extend').classList.add('active');
            document.getElementById('extend-label').textContent = '+3m Added';
            document.getElementById('call-timer').textContent = formatTimer(state.callSecondsLeft);
            document.getElementById('call-status-msg').textContent =
                'Edge Case Triggered: Both tapped Extend +3 (+180s added)!';
            playSound('extend');
            logEvent('extend_plus_3m', { mutual_tap: true, new_timer: formatTimer(state.callSecondsLeft) });
        });

        document.getElementById('edge-abuse-report').addEventListener('click', function () {
            if (state.stage !== 4) goToStage(4, true);
            var dlg = document.getElementById('dialog-report');
            if (dlg && dlg.showModal) dlg.showModal();
        });

        document.getElementById('btn-clear-log').addEventListener('click', function () {
            document.getElementById('event-log').innerHTML = '';
            logEvent('telemetry_reset', { status: 'ready' });
        });

        /* ======================================================================
           ARCADE CONTROL DOCK & KEYBOARD SHORTCUTS
           ====================================================================== */
        function runShortcutAction(action) {
            if (action === 'stage') {
                var nextStage = (state.stage % 6) + 1;
                goToStage(nextStage);
            } else if (action === 'heart') {
                if (state.stage !== 4) goToStage(4, true);
                document.getElementById('btn-heart').click();
            } else if (action === 'ice') {
                if (state.stage !== 4) goToStage(4, true);
                document.getElementById('btn-shuffle-ice').click();
            } else if (action === 'extend') {
                if (state.stage !== 4) goToStage(4, true);
                document.getElementById('btn-extend').click();
            } else if (action === 'mute') {
                if (state.stage !== 4) goToStage(4, true);
                document.getElementById('btn-mute').click();
            }
        }

        document.querySelectorAll('[data-shortcut]').forEach(function (chip) {
            chip.addEventListener('click', function () {
                runShortcutAction(chip.getAttribute('data-shortcut'));
            });
        });

        window.addEventListener('keydown', function (e) {
            var activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            if (activeTag === 'input' || activeTag === 'textarea' || e.metaKey || e.ctrlKey || e.altKey) {
                return;
            }
            var k = e.key.toLowerCase();
            if (k >= '1' && k <= '6') {
                goToStage(Number(k));
            } else if (k === 'h') {
                runShortcutAction('heart');
            } else if (k === 'r') {
                runShortcutAction('ice');
            } else if (k === 'e') {
                runShortcutAction('extend');
            } else if (k === 'm') {
                runShortcutAction('mute');
            }
        });

        /* ======================================================================
           DIALOG MODALS (PRICING, CASE BRIEF, SAFETY REPORT)
           ====================================================================== */
        function openDialog(id) {
            var dlg = document.getElementById(id);
            if (dlg && dlg.showModal) {
                dlg.showModal();
                playSound('click');
            }
        }

        document.getElementById('btn-open-pricing').addEventListener('click', function () {
            openDialog('dialog-pricing');
        });
        document.getElementById('btn-token-badge').addEventListener('click', function () {
            openDialog('dialog-pricing');
        });
        document.getElementById('btn-open-case').addEventListener('click', function () {
            openDialog('dialog-case');
        });

        document.querySelectorAll('[data-close-dialog]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-close-dialog');
                var dlg = document.getElementById(id);
                if (dlg && dlg.close) dlg.close();
            });
        });

        document.querySelectorAll('[data-select-tier]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                state.tier = btn.getAttribute('data-select-tier');
                state.tokens = state.tier === 'free' ? 3 : 99;
                syncPersonaAndTierUI();
                var dlg = document.getElementById('dialog-pricing');
                if (dlg && dlg.close) dlg.close();
                playSound('extend');
                logEvent('tier_change', { tier: state.tier });
            });
        });

        document.querySelectorAll('[data-submit-report]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var reason = btn.getAttribute('data-submit-report');
                var dlg = document.getElementById('dialog-report');
                if (dlg && dlg.close) dlg.close();
                stopCallClock();
                state.metrics.reportsPer1k = +(state.metrics.reportsPer1k + 0.1).toFixed(1);
                updateTelemetryHUD();
                playSound('report');
                logEvent('safety_report_logged', {
                    reason: reason.slice(0, 20),
                    audio_recorded: false,
                    dpdp_2023_metadata: 'retained_24h'
                });
                goToStage(3, true);
                document.getElementById('queue-timeout-alert').textContent =
                    'Caller reported & blocked. Session metadata queued for safety review; your token was refunded.';
                document.getElementById('queue-timeout-alert').classList.add('visible');
            });
        });
    }

    initEvents();
    var urlStage = Number(new URLSearchParams(window.location.search).get('stage'));
    if (urlStage >= 1 && urlStage <= 6) {
        goToStage(urlStage, true);
    }
    requestAnimationFrame(animateSprites);
})();
