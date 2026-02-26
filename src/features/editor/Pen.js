export function createPen(canvas, opts = {}) {
    if(!canvas) return;

    const ctx = canvas.getContext("2d");
    if(!ctx) return;
    
    const state = {
        drawing: false,
        color: opts.color ?? "#222",
        width: opts.width ?? 4,
        lineCap: opts.lineCap ?? "round",
        lineJoin: opts.lineJoin ?? "round",
        globalAlpha: opts.globalAlpha ?? 1,
        last: {x: 0, y: 0},
        dpr: 1
    }

    console.debug("ctx", ctx);

    function setStyle() {
        ctx.strokeStyle = state.color;
        ctx.lineWidth = state.width;
        ctx.lineCap = state.lineCap;
        ctx.lineJoin = state.lineJoin;
        ctx.globalAlpha = state.globalAlpha;
    }

    // 그리기 좌표
    function getPointer(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        const x = (clientX - rect.left) * state.dpr;
        const y = (clientY - rect.top) * state.dpr;
        return {x, y};
    }

    function pointerDown(e) {
        e.preventDefault();
        state.drawing = true;
        const p = getPointer(e);
        state.last = p;

        setStyle();
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    }

    function pointerMove(e) {
        if(!state.drawing) return;
        e.preventDefault();

        const p = getPointer(e);
        setStyle();
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        state.last = p;
    }

    function pointerUp(e) {
        if(!state.drawing) return;
        e.preventDefault();
        state.drawing = false;
        ctx.closePath();
    }

    function attach() {
        canvas.style.touchAction = "none";
        
        canvas.addEventListener("pointerdown", pointerDown);
        canvas.addEventListener("pointermove", pointerMove);
        canvas.addEventListener("pointerup", pointerUp);
        canvas.addEventListener("pointercancel", pointerUp);
    }

    function detach() {
        canvas.removeEventListener("pointerdown", pointerDown);
        canvas.removeEventListener("pointermove", pointerMove);
        canvas.removeEventListener("pointerup", pointerUp);
        canvas.removeEventListener("pointercancel", pointerUp);
    }

    function setColor(color) {
        state.color = color;
    }

    function setWidth(width) {
        state.width = width;
    }

    function setOpacity(globalAlpha) {
      state.globalAlpha = Math.max(0, Math.min(1, globalAlpha));
    }

    function resizeToCssSize({ cssWidth, cssHeight, dpr = window.devicePixelRatio || 1 }) {
        state.dpr = dpr;

        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;

        canvas.width = Math.round(cssWidth * dpr);
        canvas.height = Math.round(cssHeight * dpr);
    }
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
    }

    return { attach, detach, setColor, setOpacity, setWidth, resizeToCssSize, clear };
}

export function handlePen(canvas) {
    console.debug("펜 도구 함수", canvas)
    const pen = createPen(canvas, {color:"red"})
    pen.attach();
    return pen;
}