var rough = function () {
    "use strict";
    const t = "undefined" != typeof self;

    class e {
        constructor(t, e) {
            this.defaultOptions = {
                maxRandomnessOffset: 2,
                roughness: 1,
                bowing: 1,
                stroke: "#000",
                strokeWidth: 1,
                curveTightness: 0,
                curveStepCount: 9,
                fillStyle: "hachure",
                fillWeight: -1,
                hachureAngle: -41,
                hachureGap: -1,
                dashOffset: -1,
                dashGap: -1,
                zigzagOffset: -1
            }, this.config = t || {}, this.surface = e, this.config.options && (this.defaultOptions = this._options(this.config.options))
        }

        _options(t) {
            return t ? Object.assign({}, this.defaultOptions, t) : this.defaultOptions
        }

        _drawable(t, e, s) {
            return {shape: t, sets: e || [], options: s || this.defaultOptions}
        }

        getCanvasSize() {
            const t = t => t && "object" == typeof t && t.baseVal && t.baseVal.value ? t.baseVal.value : t || 100;
            return this.surface ? [t(this.surface.width), t(this.surface.height)] : [100, 100]
        }

        computePolygonSize(t) {
            if (t.length) {
                let e = t[0][0], s = t[0][0], i = t[0][1], h = t[0][1];
                for (let n = 1; n < t.length; n++) e = Math.min(e, t[n][0]), s = Math.max(s, t[n][0]), i = Math.min(i, t[n][1]), h = Math.max(h, t[n][1]);
                return [s - e, h - i]
            }
            return [0, 0]
        }

        polygonPath(t) {
            let e = "";
            if (t.length) {
                e = `M${t[0][0]},${t[0][1]}`;
                for (let s = 1; s < t.length; s++) e = `${e} L${t[s][0]},${t[s][1]}`
            }
            return e
        }

        computePathSize(e) {
            let s = [0, 0];
            if (t && self.document) try {
                const t = "http://www.w3.org/2000/svg", i = self.document.createElementNS(t, "svg");
                i.setAttribute("width", "0"), i.setAttribute("height", "0");
                const h = self.document.createElementNS(t, "path");
                h.setAttribute("d", e), i.appendChild(h), self.document.body.appendChild(i);
                const n = h.getBBox();
                n && (s[0] = n.width || 0, s[1] = n.height || 0), self.document.body.removeChild(i)
            } catch (t) {
            }
            const i = this.getCanvasSize();
            return s[0] * s[1] || (s = i), s
        }

        toPaths(t) {
            const e = t.sets || [], s = t.options || this.defaultOptions, i = [];
            for (var t of e) {
                let e = null;
                switch (t.type) {
                    case"path":
                        e = {d: this.opsToPath(t), stroke: s.stroke, strokeWidth: s.strokeWidth, fill: "none"};
                        break;
                    case"fillPath":
                        e = {d: this.opsToPath(t), stroke: "none", strokeWidth: 0, fill: s.fill || "none"};
                        break;
                    case"fillSketch":
                        e = this.fillSketch(t, s);
                        break;
                    case"path2Dfill":
                        e = {d: t.path || "", stroke: "none", strokeWidth: 0, fill: s.fill || "none"};
                        break;
                    case"path2Dpattern": {
                        const i = t.size, h = {x: 0, y: 0, width: 1, height: 1, viewBox: `0 0 ${Math.round(i[0])} ${Math.round(i[1])}`, patternUnits: "objectBoundingBox", path: this.fillSketch(t, s)};
                        e = {d: t.path, stroke: "none", strokeWidth: 0, pattern: h};
                        break
                    }
                }
                e && i.push(e)
            }
            return i
        }

        fillSketch(t, e) {
            let s = e.fillWeight;
            return s < 0 && (s = e.strokeWidth / 2), {d: this.opsToPath(t), stroke: e.fill || "none", strokeWidth: s, fill: "none"}
        }

        opsToPath(t) {
            let e = "";
            for (const s of t.ops) {
                const t = s.data;
                switch (s.op) {
                    case"move":
                        e += `M${t[0]} ${t[1]} `;
                        break;
                    case"bcurveTo":
                        e += `C${t[0]} ${t[1]}, ${t[2]} ${t[3]}, ${t[4]} ${t[5]} `;
                        break;
                    case"qcurveTo":
                        e += `Q${t[0]} ${t[1]}, ${t[2]} ${t[3]} `;
                        break;
                    case"lineTo":
                        e += `L${t[0]} ${t[1]} `
                }
            }
            return e.trim()
        }
    }

    function s(t, e) {
        return t.type === e
    }

    const i = {A: 7, a: 7, C: 6, c: 6, H: 1, h: 1, L: 2, l: 2, M: 2, m: 2, Q: 4, q: 4, S: 4, s: 4, T: 4, t: 2, V: 1, v: 1, Z: 0, z: 0};

    class h {
        constructor(t) {
            this.COMMAND = 0, this.NUMBER = 1, this.EOD = 2, this.segments = [], this.parseData(t), this.processPoints()
        }

        tokenize(t) {
            const e = new Array;
            for (; "" !== t;) if (t.match(/^([ \t\r\n,]+)/)) t = t.substr(RegExp.$1.length); else if (t.match(/^([aAcChHlLmMqQsStTvVzZ])/)) e[e.length] = {type: this.COMMAND, text: RegExp.$1}, t = t.substr(RegExp.$1.length); else {
                if (!t.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) return console.error("Unrecognized segment command: " + t), [];
                e[e.length] = {type: this.NUMBER, text: `${parseFloat(RegExp.$1)}`}, t = t.substr(RegExp.$1.length)
            }
            return e[e.length] = {type: this.EOD, text: ""}, e
        }

        parseData(t) {
            const e = this.tokenize(t);
            let h = 0, n = e[h], a = "BOD";
            for (this.segments = new Array; !s(n, this.EOD);) {
                let o;
                const r = new Array;
                if ("BOD" === a) {
                    if ("M" !== n.text && "m" !== n.text) return void this.parseData("M0,0" + t);
                    h++, o = i[n.text], a = n.text
                } else s(n, this.NUMBER) ? o = i[a] : (h++, o = i[n.text], a = n.text);
                if (h + o < e.length) {
                    for (let t = h; t < h + o; t++) {
                        const i = e[t];
                        if (!s(i, this.NUMBER)) return void console.error("Parameter type is not a number: " + a + "," + i.text);
                        r[r.length] = +i.text
                    }
                    if ("number" != typeof i[a]) return void console.error("Unsupported segment type: " + a);
                    {
                        const t = {key: a, data: r};
                        this.segments.push(t), n = e[h += o], "M" === a && (a = "L"), "m" === a && (a = "l")
                    }
                } else console.error("Path data ended before all parameters were found")
            }
        }

        get closed() {
            if (void 0 === this._closed) {
                this._closed = !1;
                for (const t of this.segments) "z" === t.key.toLowerCase() && (this._closed = !0)
            }
            return this._closed
        }

        processPoints() {
            let t = null, e = [0, 0];
            for (let s = 0; s < this.segments.length; s++) {
                const i = this.segments[s];
                switch (i.key) {
                    case"M":
                    case"L":
                    case"T":
                        i.point = [i.data[0], i.data[1]];
                        break;
                    case"m":
                    case"l":
                    case"t":
                        i.point = [i.data[0] + e[0], i.data[1] + e[1]];
                        break;
                    case"H":
                        i.point = [i.data[0], e[1]];
                        break;
                    case"h":
                        i.point = [i.data[0] + e[0], e[1]];
                        break;
                    case"V":
                        i.point = [e[0], i.data[0]];
                        break;
                    case"v":
                        i.point = [e[0], i.data[0] + e[1]];
                        break;
                    case"z":
                    case"Z":
                        t && (i.point = [t[0], t[1]]);
                        break;
                    case"C":
                        i.point = [i.data[4], i.data[5]];
                        break;
                    case"c":
                        i.point = [i.data[4] + e[0], i.data[5] + e[1]];
                        break;
                    case"S":
                        i.point = [i.data[2], i.data[3]];
                        break;
                    case"s":
                        i.point = [i.data[2] + e[0], i.data[3] + e[1]];
                        break;
                    case"Q":
                        i.point = [i.data[2], i.data[3]];
                        break;
                    case"q":
                        i.point = [i.data[2] + e[0], i.data[3] + e[1]];
                        break;
                    case"A":
                        i.point = [i.data[5], i.data[6]];
                        break;
                    case"a":
                        i.point = [i.data[5] + e[0], i.data[6] + e[1]]
                }
                "m" !== i.key && "M" !== i.key || (t = null), i.point && (e = i.point, t || (t = i.point)), "z" !== i.key && "Z" !== i.key || (t = null)
            }
        }
    }

    class n {
        constructor(t) {
            this._position = [0, 0], this._first = null, this.bezierReflectionPoint = null, this.quadReflectionPoint = null, this.parsed = new h(t)
        }

        get segments() {
            return this.parsed.segments
        }

        get closed() {
            return this.parsed.closed
        }

        get linearPoints() {
            if (!this._linearPoints) {
                const t = [];
                let e = [];
                for (const s of this.parsed.segments) {
                    const i = s.key.toLowerCase();
                    ("m" !== i && "z" !== i || (e.length && (t.push(e), e = []), "z" !== i)) && (s.point && e.push(s.point))
                }
                e.length && (t.push(e), e = []), this._linearPoints = t
            }
            return this._linearPoints
        }

        get first() {
            return this._first
        }

        set first(t) {
            this._first = t
        }

        setPosition(t, e) {
            this._position = [t, e], this._first || (this._first = [t, e])
        }

        get position() {
            return this._position
        }

        get x() {
            return this._position[0]
        }

        get y() {
            return this._position[1]
        }
    }

    class a {
        constructor(t, e, s, i, h, n) {
            if (this._segIndex = 0, this._numSegs = 0, this._rx = 0, this._ry = 0, this._sinPhi = 0, this._cosPhi = 0, this._C = [0, 0], this._theta = 0, this._delta = 0, this._T = 0, this._from = t, t[0] === e[0] && t[1] === e[1]) return;
            const a = Math.PI / 180;
            this._rx = Math.abs(s[0]), this._ry = Math.abs(s[1]), this._sinPhi = Math.sin(i * a), this._cosPhi = Math.cos(i * a);
            const o = this._cosPhi * (t[0] - e[0]) / 2 + this._sinPhi * (t[1] - e[1]) / 2, r = -this._sinPhi * (t[0] - e[0]) / 2 + this._cosPhi * (t[1] - e[1]) / 2;
            let l = 0;
            const c = this._rx * this._rx * this._ry * this._ry - this._rx * this._rx * r * r - this._ry * this._ry * o * o;
            if (c < 0) {
                const t = Math.sqrt(1 - c / (this._rx * this._rx * this._ry * this._ry));
                this._rx = this._rx * t, this._ry = this._ry * t, l = 0
            } else l = (h === n ? -1 : 1) * Math.sqrt(c / (this._rx * this._rx * r * r + this._ry * this._ry * o * o));
            const p = l * this._rx * r / this._ry, u = -l * this._ry * o / this._rx;
            this._C = [0, 0], this._C[0] = this._cosPhi * p - this._sinPhi * u + (t[0] + e[0]) / 2, this._C[1] = this._sinPhi * p + this._cosPhi * u + (t[1] + e[1]) / 2, this._theta = this.calculateVectorAngle(1, 0, (o - p) / this._rx, (r - u) / this._ry);
            let f = this.calculateVectorAngle((o - p) / this._rx, (r - u) / this._ry, (-o - p) / this._rx, (-r - u) / this._ry);
            !n && f > 0 ? f -= 2 * Math.PI : n && f < 0 && (f += 2 * Math.PI), this._numSegs = Math.ceil(Math.abs(f / (Math.PI / 2))), this._delta = f / this._numSegs, this._T = 8 / 3 * Math.sin(this._delta / 4) * Math.sin(this._delta / 4) / Math.sin(this._delta / 2)
        }

        getNextSegment() {
            if (this._segIndex === this._numSegs) return null;
            const t = Math.cos(this._theta), e = Math.sin(this._theta), s = this._theta + this._delta, i = Math.cos(s), h = Math.sin(s),
                n = [this._cosPhi * this._rx * i - this._sinPhi * this._ry * h + this._C[0], this._sinPhi * this._rx * i + this._cosPhi * this._ry * h + this._C[1]],
                a = [this._from[0] + this._T * (-this._cosPhi * this._rx * e - this._sinPhi * this._ry * t), this._from[1] + this._T * (-this._sinPhi * this._rx * e + this._cosPhi * this._ry * t)],
                o = [n[0] + this._T * (this._cosPhi * this._rx * h + this._sinPhi * this._ry * i), n[1] + this._T * (this._sinPhi * this._rx * h - this._cosPhi * this._ry * i)];
            return this._theta = s, this._from = [n[0], n[1]], this._segIndex++, {cp1: a, cp2: o, to: n}
        }

        calculateVectorAngle(t, e, s, i) {
            const h = Math.atan2(e, t), n = Math.atan2(i, s);
            return n >= h ? n - h : 2 * Math.PI - (h - n)
        }
    }

    class o {
        constructor(t, e) {
            this.sets = t, this.closed = e
        }

        fit(t) {
            const e = [];
            for (const s of this.sets) {
                const i = s.length;
                let h = Math.floor(t * i);
                if (h < 5) {
                    if (i <= 5) continue;
                    h = 5
                }
                e.push(this.reduce(s, h))
            }
            let s = "";
            for (var t of e) {
                for (let e = 0; e < t.length; e++) {
                    const i = t[e];
                    s += 0 === e ? "M" + i[0] + "," + i[1] : "L" + i[0] + "," + i[1]
                }
                this.closed && (s += "z ")
            }
            return s
        }

        distance(t, e) {
            return Math.sqrt(Math.pow(t[0] - e[0], 2) + Math.pow(t[1] - e[1], 2))
        }

        reduce(t, e) {
            if (t.length <= e) return t;
            const s = t.slice(0);
            for (; s.length > e;) {
                let t = -1, e = -1;
                for (let i = 1; i < s.length - 1; i++) {
                    const h = this.distance(s[i - 1], s[i]), n = this.distance(s[i], s[i + 1]), a = this.distance(s[i - 1], s[i + 1]), o = (h + n + a) / 2, r = Math.sqrt(o * (o - h) * (o - n) * (o - a));
                    (t < 0 || r < t) && (t = r, e = i)
                }
                if (!(e > 0)) break;
                s.splice(e, 1)
            }
            return s
        }
    }

    class r {
        constructor(t, e) {
            this.xi = Number.MAX_VALUE, this.yi = Number.MAX_VALUE, this.px1 = t[0], this.py1 = t[1], this.px2 = e[0], this.py2 = e[1], this.a = this.py2 - this.py1, this.b = this.px1 - this.px2, this.c = this.px2 * this.py1 - this.px1 * this.py2, this._undefined = 0 === this.a && 0 === this.b && 0 === this.c
        }

        isUndefined() {
            return this._undefined
        }

        intersects(t) {
            if (this.isUndefined() || t.isUndefined()) return !1;
            let e = Number.MAX_VALUE, s = Number.MAX_VALUE, i = 0, h = 0;
            const n = this.a, a = this.b, o = this.c;
            return Math.abs(a) > 1e-5 && (e = -n / a, i = -o / a), Math.abs(t.b) > 1e-5 && (s = -t.a / t.b, h = -t.c / t.b), e === Number.MAX_VALUE ? s === Number.MAX_VALUE ? -o / n == -t.c / t.a && (this.py1 >= Math.min(t.py1, t.py2) && this.py1 <= Math.max(t.py1, t.py2) ? (this.xi = this.px1, this.yi = this.py1, !0) : this.py2 >= Math.min(t.py1, t.py2) && this.py2 <= Math.max(t.py1, t.py2) && (this.xi = this.px2, this.yi = this.py2, !0)) : (this.xi = this.px1, this.yi = s * this.xi + h, !((this.py1 - this.yi) * (this.yi - this.py2) < -1e-5 || (t.py1 - this.yi) * (this.yi - t.py2) < -1e-5) && (!(Math.abs(t.a) < 1e-5) || !((t.px1 - this.xi) * (this.xi - t.px2) < -1e-5))) : s === Number.MAX_VALUE ? (this.xi = t.px1, this.yi = e * this.xi + i, !((t.py1 - this.yi) * (this.yi - t.py2) < -1e-5 || (this.py1 - this.yi) * (this.yi - this.py2) < -1e-5) && (!(Math.abs(n) < 1e-5) || !((this.px1 - this.xi) * (this.xi - this.px2) < -1e-5))) : e === s ? i === h && (this.px1 >= Math.min(t.px1, t.px2) && this.px1 <= Math.max(t.py1, t.py2) ? (this.xi = this.px1, this.yi = this.py1, !0) : this.px2 >= Math.min(t.px1, t.px2) && this.px2 <= Math.max(t.px1, t.px2) && (this.xi = this.px2, this.yi = this.py2, !0)) : (this.xi = (h - i) / (e - s), this.yi = e * this.xi + i, !((this.px1 - this.xi) * (this.xi - this.px2) < -1e-5 || (t.px1 - this.xi) * (this.xi - t.px2) < -1e-5))
        }
    }

    function l(t, e) {
        const s = t[1][1] - t[0][1], i = t[0][0] - t[1][0], h = s * t[0][0] + i * t[0][1], n = e[1][1] - e[0][1], a = e[0][0] - e[1][0], o = n * e[0][0] + a * e[0][1], r = s * a - n * i;
        return r ? [Math.round((a * h - i * o) / r), Math.round((s * o - n * h) / r)] : null
    }

    class c {
        constructor(t, e, s, i, h, n, a, o) {
            this.deltaX = 0, this.hGap = 0, this.top = t, this.bottom = e, this.left = s, this.right = i, this.gap = h, this.sinAngle = n, this.tanAngle = o, Math.abs(n) < 1e-4 ? this.pos = s + h : Math.abs(n) > .9999 ? this.pos = t + h : (this.deltaX = (e - t) * Math.abs(o), this.pos = s - Math.abs(this.deltaX), this.hGap = Math.abs(h / a), this.sLeft = new r([s, e], [s, t]), this.sRight = new r([i, e], [i, t]))
        }

        nextLine() {
            if (Math.abs(this.sinAngle) < 1e-4) {
                if (this.pos < this.right) {
                    const t = [this.pos, this.top, this.pos, this.bottom];
                    return this.pos += this.gap, t
                }
            } else if (Math.abs(this.sinAngle) > .9999) {
                if (this.pos < this.bottom) {
                    const t = [this.left, this.pos, this.right, this.pos];
                    return this.pos += this.gap, t
                }
            } else {
                let t = this.pos - this.deltaX / 2, e = this.pos + this.deltaX / 2, s = this.bottom, i = this.top;
                if (this.pos < this.right + this.deltaX) {
                    for (; t < this.left && e < this.left || t > this.right && e > this.right;) if (this.pos += this.hGap, t = this.pos - this.deltaX / 2, e = this.pos + this.deltaX / 2, this.pos > this.right + this.deltaX) return null;
                    const h = new r([t, s], [e, i]);
                    this.sLeft && h.intersects(this.sLeft) && (t = h.xi, s = h.yi), this.sRight && h.intersects(this.sRight) && (e = h.xi, i = h.yi), this.tanAngle > 0 && (t = this.right - (t - this.left), e = this.right - (e - this.left));
                    const n = [t, s, e, i];
                    return this.pos += this.hGap, n
                }
            }
            return null
        }
    }

    function p(t) {
        const e = t[0], s = t[1];
        return Math.sqrt(Math.pow(e[0] - s[0], 2) + Math.pow(e[1] - s[1], 2))
    }

    function u(t, e) {
        const s = [], i = new r([t[0], t[1]], [t[2], t[3]]);
        for (let t = 0; t < e.length; t++) {
            const h = new r(e[t], e[(t + 1) % e.length]);
            i.intersects(h) && s.push([i.xi, i.yi])
        }
        return s
    }

    function f(t, e, s, i, h, n, a) {
        return [-s * n - i * h + s + n * t + h * e, a * (s * h - i * n) + i + -a * h * t + a * n * e]
    }

    function d(t, e) {
        const s = [];
        if (t && t.length) {
            let i = t[0][0], h = t[0][0], n = t[0][1], a = t[0][1];
            for (let e = 1; e < t.length; e++) i = Math.min(i, t[e][0]), h = Math.max(h, t[e][0]), n = Math.min(n, t[e][1]), a = Math.max(a, t[e][1]);
            const o = e.hachureAngle;
            let r = e.hachureGap;
            r < 0 && (r = 4 * e.strokeWidth), r = Math.max(r, .1);
            const l = o % 180 * (Math.PI / 180), p = Math.cos(l), f = Math.sin(l), d = Math.tan(l), g = new c(n - 1, a + 1, i - 1, h + 1, r, f, p, d);
            let y;
            for (; null != (y = g.nextLine());) {
                const e = u(y, t);
                for (let t = 0; t < e.length; t++) if (t < e.length - 1) {
                    const i = e[t], h = e[t + 1];
                    s.push([i, h])
                }
            }
        }
        return s
    }

    function g(t, e, s, i, h, n) {
        const a = [];
        let o = Math.abs(i / 2), r = Math.abs(h / 2);
        o += t.randOffset(.05 * o, n), r += t.randOffset(.05 * r, n);
        const l = n.hachureAngle;
        let c = n.hachureGap;
        c <= 0 && (c = 4 * n.strokeWidth);
        let p = n.fillWeight;
        p < 0 && (p = n.strokeWidth / 2);
        const u = l % 180 * (Math.PI / 180), d = Math.tan(u), g = r / o, y = Math.sqrt(g * d * g * d + 1), M = g * d / y, x = 1 / y, _ = c / (o * r / Math.sqrt(r * x * (r * x) + o * M * (o * M)) / o);
        let b = Math.sqrt(o * o - (e - o + _) * (e - o + _));
        for (let t = e - o + _; t < e + o; t += _) {
            const i = f(t, s - (b = Math.sqrt(o * o - (e - t) * (e - t))), e, s, M, x, g), h = f(t, s + b, e, s, M, x, g);
            a.push([i, h])
        }
        return a
    }

    class y {
        constructor(t) {
            this.helper = t
        }

        fillPolygon(t, e) {
            return this._fillPolygon(t, e)
        }

        fillEllipse(t, e, s, i, h) {
            return this._fillEllipse(t, e, s, i, h)
        }

        fillArc(t, e, s, i, h, n, a) {
            return null
        }

        _fillPolygon(t, e, s = !1) {
            const i = d(t, e);
            return {type: "fillSketch", ops: this.renderLines(i, e, s)}
        }

        _fillEllipse(t, e, s, i, h, n = !1) {
            const a = g(this.helper, t, e, s, i, h);
            return {type: "fillSketch", ops: this.renderLines(a, h, n)}
        }

        renderLines(t, e, s) {
            let i = [], h = null;
            for (const n of t) i = i.concat(this.helper.doubleLineOps(n[0][0], n[0][1], n[1][0], n[1][1], e)), s && h && (i = i.concat(this.helper.doubleLineOps(h[0], h[1], n[0][0], n[0][1], e))), h = n[1];
            return i
        }
    }

    class M extends y {
        fillPolygon(t, e) {
            return this._fillPolygon(t, e, !0)
        }

        fillEllipse(t, e, s, i, h) {
            return this._fillEllipse(t, e, s, i, h, !0)
        }
    }

    class x extends y {
        fillPolygon(t, e) {
            const s = this._fillPolygon(t, e), i = Object.assign({}, e, {hachureAngle: e.hachureAngle + 90}), h = this._fillPolygon(t, i);
            return s.ops = s.ops.concat(h.ops), s
        }

        fillEllipse(t, e, s, i, h) {
            const n = this._fillEllipse(t, e, s, i, h), a = Object.assign({}, h, {hachureAngle: h.hachureAngle + 90}), o = this._fillEllipse(t, e, s, i, a);
            return n.ops = n.ops.concat(o.ops), n
        }
    }

    class _ {
        constructor(t) {
            this.helper = t
        }

        fillPolygon(t, e) {
            const s = d(t, e = Object.assign({}, e, {curveStepCount: 4, hachureAngle: 0}));
            return this.dotsOnLines(s, e)
        }

        fillEllipse(t, e, s, i, h) {
            h = Object.assign({}, h, {curveStepCount: 4, hachureAngle: 0});
            const n = g(this.helper, t, e, s, i, h);
            return this.dotsOnLines(n, h)
        }

        fillArc(t, e, s, i, h, n, a) {
            return null
        }

        dotsOnLines(t, e) {
            let s = [], i = e.hachureGap;
            i < 0 && (i = 4 * e.strokeWidth), i = Math.max(i, .1);
            let h = e.fillWeight;
            h < 0 && (h = e.strokeWidth / 2);
            for (const n of t) {
                const t = p(n) / i, a = Math.ceil(t) - 1, o = Math.atan((n[1][1] - n[0][1]) / (n[1][0] - n[0][0]));
                for (let t = 0; t < a; t++) {
                    const a = i * (t + 1), r = a * Math.sin(o), l = a * Math.cos(o), c = [n[0][0] - l, n[0][1] + r], p = this.helper.randOffsetWithRange(c[0] - i / 4, c[0] + i / 4, e),
                        u = this.helper.randOffsetWithRange(c[1] - i / 4, c[1] + i / 4, e), f = this.helper.ellipse(p, u, h, h, e);
                    s = s.concat(f.ops)
                }
            }
            return {type: "fillSketch", ops: s}
        }
    }

    class b {
        constructor(t) {
            this.helper = t
        }

        fillPolygon(t, e) {
            const s = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER], i = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
            t.forEach(t => {
                s[0] = Math.min(s[0], t[0]), s[1] = Math.max(s[1], t[0]), i[0] = Math.min(i[0], t[1]), i[1] = Math.max(i[1], t[1])
            });
            const h = function (t) {
                let e = 0, s = 0, i = 0;
                for (let s = 0; s < t.length; s++) {
                    const i = t[s], h = s === t.length - 1 ? t[0] : t[s + 1];
                    e += i[0] * h[1] - h[0] * i[1]
                }
                e /= 2;
                for (let e = 0; e < t.length; e++) {
                    const h = t[e], n = e === t.length - 1 ? t[0] : t[e + 1];
                    s += (h[0] + n[0]) * (h[0] * n[1] - n[0] * h[1]), i += (h[1] + n[1]) * (h[0] * n[1] - n[0] * h[1])
                }
                return [s / (6 * e), i / (6 * e)]
            }(t), n = Math.max(Math.sqrt(Math.pow(h[0] - s[0], 2) + Math.pow(h[1] - i[0], 2)), Math.sqrt(Math.pow(h[0] - s[1], 2) + Math.pow(h[1] - i[1], 2))), a = e.hachureGap > 0 ? e.hachureGap : 4 * e.strokeWidth, o = [];
            if (t.length > 2) for (let e = 0; e < t.length; e++) e === t.length - 1 ? o.push([t[e], t[0]]) : o.push([t[e], t[e + 1]]);
            let r = [];
            const c = Math.max(1, Math.PI * n / a);
            for (let t = 0; t < c; t++) {
                const e = t * Math.PI / c, a = [h, [h[0] + n * Math.cos(e), h[1] + n * Math.sin(e)]];
                o.forEach(t => {
                    const e = l(t, a);
                    e && e[0] >= s[0] && e[0] <= s[1] && e[1] >= i[0] && e[1] <= i[1] && r.push(e)
                })
            }
            r = this.removeDuplocatePoints(r);
            const p = this.createLinesFromCenter(h, r);
            return {type: "fillSketch", ops: this.drawLines(p, e)}
        }

        fillEllipse(t, e, s, i, h) {
            return this.fillArcSegment(t, e, s, i, 0, 2 * Math.PI, h)
        }

        fillArc(t, e, s, i, h, n, a) {
            return this.fillArcSegment(t, e, s, i, h, n, a)
        }

        fillArcSegment(t, e, s, i, h, n, a) {
            const o = [t, e], r = s / 2, l = i / 2, c = Math.max(s / 2, i / 2);
            let p = a.hachureGap;
            p < 0 && (p = 4 * a.strokeWidth);
            const u = Math.max(1, Math.abs(n - h) * c / p);
            let f = [];
            for (let t = 0; t < u; t++) {
                const e = t * ((n - h) / u) + h, s = c * Math.cos(e), i = c * Math.sin(e), a = Math.sqrt(r * r * i * i + l * l * s * s), p = r * l * s / a, d = r * l * i / a;
                f.push([o[0] + p, o[1] + d])
            }
            f = this.removeDuplocatePoints(f);
            const d = this.createLinesFromCenter(o, f);
            return {type: "fillSketch", ops: this.drawLines(d, a)}
        }

        drawLines(t, e) {
            let s = [];
            return t.forEach(t => {
                const i = t[0], h = t[1];
                s = s.concat(this.helper.doubleLineOps(i[0], i[1], h[0], h[1], e))
            }), s
        }

        createLinesFromCenter(t, e) {
            return e.map(e => [t, e])
        }

        removeDuplocatePoints(t) {
            const e = new Set;
            return t.filter(t => {
                const s = t.join(",");
                return !e.has(s) && (e.add(s), !0)
            })
        }
    }

    class m {
        constructor(t) {
            this.helper = t
        }

        fillPolygon(t, e) {
            const s = d(t, e);
            return {type: "fillSketch", ops: this.dashedLine(s, e)}
        }

        fillEllipse(t, e, s, i, h) {
            const n = g(this.helper, t, e, s, i, h);
            return {type: "fillSketch", ops: this.dashedLine(n, h)}
        }

        fillArc(t, e, s, i, h, n, a) {
            return null
        }

        dashedLine(t, e) {
            const s = e.dashOffset < 0 ? e.hachureGap < 0 ? 4 * e.strokeWidth : e.hachureGap : e.dashOffset, i = e.dashGap < 0 ? e.hachureGap < 0 ? 4 * e.strokeWidth : e.hachureGap : e.dashGap;
            let h = [];
            return t.forEach(t => {
                const n = p(t), a = Math.floor(n / (s + i)), o = (n + i - a * (s + i)) / 2;
                let r = t[0], l = t[1];
                r[0] > l[0] && (r = t[1], l = t[0]);
                const c = Math.atan((l[1] - r[1]) / (l[0] - r[0]));
                for (let t = 0; t < a; t++) {
                    const n = t * (s + i), a = n + s, l = [r[0] + n * Math.cos(c) + o * Math.cos(c), r[1] + n * Math.sin(c) + o * Math.sin(c)], p = [r[0] + a * Math.cos(c) + o * Math.cos(c), r[1] + a * Math.sin(c) + o * Math.sin(c)];
                    h = h.concat(this.helper.doubleLineOps(l[0], l[1], p[0], p[1], e))
                }
            }), h
        }
    }

    class w {
        constructor(t) {
            this.helper = t
        }

        fillPolygon(t, e) {
            const s = e.hachureGap < 0 ? 4 * e.strokeWidth : e.hachureGap, i = e.zigzagOffset < 0 ? s : e.zigzagOffset, h = d(t, e = Object.assign({}, e, {hachureGap: s + i}));
            return {type: "fillSketch", ops: this.zigzagLines(h, i, e)}
        }

        fillEllipse(t, e, s, i, h) {
            const n = h.hachureGap < 0 ? 4 * h.strokeWidth : h.hachureGap, a = h.zigzagOffset < 0 ? n : h.zigzagOffset;
            h = Object.assign({}, h, {hachureGap: n + a});
            const o = g(this.helper, t, e, s, i, h);
            return {type: "fillSketch", ops: this.zigzagLines(o, a, h)}
        }

        fillArc(t, e, s, i, h, n, a) {
            return null
        }

        zigzagLines(t, e, s) {
            let i = [];
            return t.forEach(t => {
                const h = p(t), n = Math.round(h / (2 * e));
                let a = t[0], o = t[1];
                a[0] > o[0] && (a = t[1], o = t[0]);
                const r = Math.atan((o[1] - a[1]) / (o[0] - a[0]));
                for (let t = 0; t < n; t++) {
                    const h = 2 * t * e, n = 2 * (t + 1) * e, o = Math.sqrt(2 * Math.pow(e, 2)), l = [a[0] + h * Math.cos(r), a[1] + h * Math.sin(r)], c = [a[0] + n * Math.cos(r), a[1] + n * Math.sin(r)],
                        p = [l[0] + o * Math.cos(r + Math.PI / 4), l[1] + o * Math.sin(r + Math.PI / 4)];
                    i = (i = i.concat(this.helper.doubleLineOps(l[0], l[1], p[0], p[1], s))).concat(this.helper.doubleLineOps(p[0], p[1], c[0], c[1], s))
                }
            }), i
        }
    }

    const k = {};

    function P(t, e) {
        let s = t.fillStyle || "hachure";
        if (!k[s]) switch (s) {
            case"zigzag":
                k[s] || (k[s] = new M(e));
                break;
            case"cross-hatch":
                k[s] || (k[s] = new x(e));
                break;
            case"dots":
                k[s] || (k[s] = new _(e));
                break;
            case"starburst":
                k[s] || (k[s] = new b(e));
                break;
            case"dashed":
                k[s] || (k[s] = new m(e));
                break;
            case"zigzag-line":
                k[s] || (k[s] = new w(e));
                break;
            case"hachure":
            default:
                k[s = "hachure"] || (k[s] = new y(e))
        }
        return k[s]
    }

    const v = {
        randOffset: function (t, e) {
            return W(t, e)
        }, randOffsetWithRange: function (t, e, s) {
            return N(t, e, s)
        }, ellipse: T, doubleLineOps: function (t, e, s, i, h) {
            return R(t, e, s, i, h)
        }
    };

    function S(t, e, s, i, h) {
        return {type: "path", ops: R(t, e, s, i, h)}
    }

    function A(t, e, s) {
        const i = (t || []).length;
        if (i > 2) {
            let h = [];
            for (let e = 0; e < i - 1; e++) h = h.concat(R(t[e][0], t[e][1], t[e + 1][0], t[e + 1][1], s));
            return e && (h = h.concat(R(t[i - 1][0], t[i - 1][1], t[0][0], t[0][1], s))), {type: "path", ops: h}
        }
        return 2 === i ? S(t[0][0], t[0][1], t[1][0], t[1][1], s) : {type: "path", ops: []}
    }

    function E(t, e, s, i, h) {
        return function (t, e) {
            return A(t, !0, e)
        }([[t, e], [t + s, e], [t + s, e + i], [t, e + i]], h)
    }

    function O(t, e) {
        const s = D(t, 1 * (1 + .2 * e.roughness), e), i = D(t, 1.5 * (1 + .22 * e.roughness), e);
        return {type: "path", ops: s.concat(i)}
    }

    function T(t, e, s, i, h) {
        const n = 2 * Math.PI / h.curveStepCount;
        let a = Math.abs(s / 2), o = Math.abs(i / 2);
        const r = $(n, t, e, a += W(.05 * a, h), o += W(.05 * o, h), 1, n * N(.1, N(.4, 1, h), h), h), l = $(n, t, e, a, o, 1.5, 0, h);
        return {type: "path", ops: r.concat(l)}
    }

    function C(t, e, s, i, h, n, a, o, r) {
        const l = t, c = e;
        let p = Math.abs(s / 2), u = Math.abs(i / 2);
        p += W(.01 * p, r), u += W(.01 * u, r);
        let f = h, d = n;
        for (; f < 0;) f += 2 * Math.PI, d += 2 * Math.PI;
        d - f > 2 * Math.PI && (f = 0, d = 2 * Math.PI);
        const g = 2 * Math.PI / r.curveStepCount, y = Math.min(g / 2, (d - f) / 2), M = G(y, l, c, p, u, f, d, 1, r), x = G(y, l, c, p, u, f, d, 1.5, r);
        let _ = M.concat(x);
        return a && (o ? _ = (_ = _.concat(R(l, c, l + p * Math.cos(f), c + u * Math.sin(f), r))).concat(R(l, c, l + p * Math.cos(d), c + u * Math.sin(d), r)) : (_.push({op: "lineTo", data: [l, c]}), _.push({
            op: "lineTo",
            data: [l + p * Math.cos(f), c + u * Math.sin(f)]
        }))), {type: "path", ops: _}
    }

    function z(t, e) {
        const s = [];
        if (t.length) {
            const i = e.maxRandomnessOffset || 0, h = t.length;
            if (h > 2) {
                s.push({op: "move", data: [t[0][0] + W(i, e), t[0][1] + W(i, e)]});
                for (let n = 1; n < h; n++) s.push({op: "lineTo", data: [t[n][0] + W(i, e), t[n][1] + W(i, e)]})
            }
        }
        return {type: "fillPath", ops: s}
    }

    function L(t, e) {
        return P(e, v).fillPolygon(t, e)
    }

    function N(t, e, s) {
        return s.roughness * (Math.random() * (e - t) + t)
    }

    function W(t, e) {
        return N(-t, t, e)
    }

    function R(t, e, s, i, h) {
        const n = I(t, e, s, i, h, !0, !1), a = I(t, e, s, i, h, !0, !0);
        return n.concat(a)
    }

    function I(t, e, s, i, h, n, a) {
        const o = Math.pow(t - s, 2) + Math.pow(e - i, 2);
        let r = h.maxRandomnessOffset || 0;
        r * r * 100 > o && (r = Math.sqrt(o) / 10);
        const l = r / 2, c = .2 + .2 * Math.random();
        let p = h.bowing * h.maxRandomnessOffset * (i - e) / 200, u = h.bowing * h.maxRandomnessOffset * (t - s) / 200;
        p = W(p, h), u = W(u, h);
        const f = [], d = () => W(l, h), g = () => W(r, h);
        return n && (a ? f.push({op: "move", data: [t + d(), e + d()]}) : f.push({op: "move", data: [t + W(r, h), e + W(r, h)]})), a ? f.push({
            op: "bcurveTo",
            data: [p + t + (s - t) * c + d(), u + e + (i - e) * c + d(), p + t + 2 * (s - t) * c + d(), u + e + 2 * (i - e) * c + d(), s + d(), i + d()]
        }) : f.push({op: "bcurveTo", data: [p + t + (s - t) * c + g(), u + e + (i - e) * c + g(), p + t + 2 * (s - t) * c + g(), u + e + 2 * (i - e) * c + g(), s + g(), i + g()]}), f
    }

    function D(t, e, s) {
        const i = [];
        i.push([t[0][0] + W(e, s), t[0][1] + W(e, s)]), i.push([t[0][0] + W(e, s), t[0][1] + W(e, s)]);
        for (let h = 1; h < t.length; h++) i.push([t[h][0] + W(e, s), t[h][1] + W(e, s)]), h === t.length - 1 && i.push([t[h][0] + W(e, s), t[h][1] + W(e, s)]);
        return q(i, null, s)
    }

    function q(t, e, s) {
        const i = t.length;
        let h = [];
        if (i > 3) {
            const n = [], a = 1 - s.curveTightness;
            h.push({op: "move", data: [t[1][0], t[1][1]]});
            for (let e = 1; e + 2 < i; e++) {
                const s = t[e];
                n[0] = [s[0], s[1]], n[1] = [s[0] + (a * t[e + 1][0] - a * t[e - 1][0]) / 6, s[1] + (a * t[e + 1][1] - a * t[e - 1][1]) / 6], n[2] = [t[e + 1][0] + (a * t[e][0] - a * t[e + 2][0]) / 6, t[e + 1][1] + (a * t[e][1] - a * t[e + 2][1]) / 6], n[3] = [t[e + 1][0], t[e + 1][1]], h.push({
                    op: "bcurveTo",
                    data: [n[1][0], n[1][1], n[2][0], n[2][1], n[3][0], n[3][1]]
                })
            }
            if (e && 2 === e.length) {
                const t = s.maxRandomnessOffset;
                h.push({op: "lineTo", data: [e[0] + W(t, s), e[1] + W(t, s)]})
            }
        } else 3 === i ? (h.push({op: "move", data: [t[1][0], t[1][1]]}), h.push({op: "bcurveTo", data: [t[1][0], t[1][1], t[2][0], t[2][1], t[2][0], t[2][1]]})) : 2 === i && (h = h.concat(R(t[0][0], t[0][1], t[1][0], t[1][1], s)));
        return h
    }

    function $(t, e, s, i, h, n, a, o) {
        const r = W(.5, o) - Math.PI / 2, l = [];
        l.push([W(n, o) + e + .9 * i * Math.cos(r - t), W(n, o) + s + .9 * h * Math.sin(r - t)]);
        for (let a = r; a < 2 * Math.PI + r - .01; a += t) l.push([W(n, o) + e + i * Math.cos(a), W(n, o) + s + h * Math.sin(a)]);
        return l.push([W(n, o) + e + i * Math.cos(r + 2 * Math.PI + .5 * a), W(n, o) + s + h * Math.sin(r + 2 * Math.PI + .5 * a)]), l.push([W(n, o) + e + .98 * i * Math.cos(r + a), W(n, o) + s + .98 * h * Math.sin(r + a)]), l.push([W(n, o) + e + .9 * i * Math.cos(r + .5 * a), W(n, o) + s + .9 * h * Math.sin(r + .5 * a)]), q(l, null, o)
    }

    function G(t, e, s, i, h, n, a, o, r) {
        const l = n + W(.1, r), c = [];
        c.push([W(o, r) + e + .9 * i * Math.cos(l - t), W(o, r) + s + .9 * h * Math.sin(l - t)]);
        for (let n = l; n <= a; n += t) c.push([W(o, r) + e + i * Math.cos(n), W(o, r) + s + h * Math.sin(n)]);
        return c.push([e + i * Math.cos(a), s + h * Math.sin(a)]), c.push([e + i * Math.cos(a), s + h * Math.sin(a)]), q(c, null, r)
    }

    function B(t, e, s, i, h, n, a, o) {
        const r = [], l = [o.maxRandomnessOffset || 1, (o.maxRandomnessOffset || 1) + .5];
        let c = [0, 0];
        for (let p = 0; p < 2; p++) 0 === p ? r.push({op: "move", data: [a.x, a.y]}) : r.push({op: "move", data: [a.x + W(l[0], o), a.y + W(l[0], o)]}), c = [h + W(l[p], o), n + W(l[p], o)], r.push({
            op: "bcurveTo",
            data: [t + W(l[p], o), e + W(l[p], o), s + W(l[p], o), i + W(l[p], o), c[0], c[1]]
        });
        return a.setPosition(c[0], c[1]), r
    }

    function X(t, e, s, i) {
        let h = [];
        switch (e.key) {
            case"M":
            case"m": {
                const s = "m" === e.key;
                if (e.data.length >= 2) {
                    let n = +e.data[0], a = +e.data[1];
                    s && (n += t.x, a += t.y);
                    const o = 1 * (i.maxRandomnessOffset || 0);
                    n += W(o, i), a += W(o, i), t.setPosition(n, a), h.push({op: "move", data: [n, a]})
                }
                break
            }
            case"L":
            case"l": {
                const s = "l" === e.key;
                if (e.data.length >= 2) {
                    let n = +e.data[0], a = +e.data[1];
                    s && (n += t.x, a += t.y), h = h.concat(R(t.x, t.y, n, a, i)), t.setPosition(n, a)
                }
                break
            }
            case"H":
            case"h": {
                const s = "h" === e.key;
                if (e.data.length) {
                    let n = +e.data[0];
                    s && (n += t.x), h = h.concat(R(t.x, t.y, n, t.y, i)), t.setPosition(n, t.y)
                }
                break
            }
            case"V":
            case"v": {
                const s = "v" === e.key;
                if (e.data.length) {
                    let n = +e.data[0];
                    s && (n += t.y), h = h.concat(R(t.x, t.y, t.x, n, i)), t.setPosition(t.x, n)
                }
                break
            }
            case"Z":
            case"z":
                t.first && (h = h.concat(R(t.x, t.y, t.first[0], t.first[1], i)), t.setPosition(t.first[0], t.first[1]), t.first = null);
                break;
            case"C":
            case"c": {
                const s = "c" === e.key;
                if (e.data.length >= 6) {
                    let n = +e.data[0], a = +e.data[1], o = +e.data[2], r = +e.data[3], l = +e.data[4], c = +e.data[5];
                    s && (n += t.x, o += t.x, l += t.x, a += t.y, r += t.y, c += t.y);
                    const p = B(n, a, o, r, l, c, t, i);
                    h = h.concat(p), t.bezierReflectionPoint = [l + (l - o), c + (c - r)]
                }
                break
            }
            case"S":
            case"s": {
                const n = "s" === e.key;
                if (e.data.length >= 4) {
                    let a = +e.data[0], o = +e.data[1], r = +e.data[2], l = +e.data[3];
                    n && (a += t.x, r += t.x, o += t.y, l += t.y);
                    let c = a, p = o;
                    const u = s ? s.key : "";
                    let f = null;
                    "c" !== u && "C" !== u && "s" !== u && "S" !== u || (f = t.bezierReflectionPoint), f && (c = f[0], p = f[1]);
                    const d = B(c, p, a, o, r, l, t, i);
                    h = h.concat(d), t.bezierReflectionPoint = [r + (r - a), l + (l - o)]
                }
                break
            }
            case"Q":
            case"q": {
                const s = "q" === e.key;
                if (e.data.length >= 4) {
                    let n = +e.data[0], a = +e.data[1], o = +e.data[2], r = +e.data[3];
                    s && (n += t.x, o += t.x, a += t.y, r += t.y);
                    const l = 1 * (1 + .2 * i.roughness), c = 1.5 * (1 + .22 * i.roughness);
                    h.push({op: "move", data: [t.x + W(l, i), t.y + W(l, i)]});
                    let p = [o + W(l, i), r + W(l, i)];
                    h.push({op: "qcurveTo", data: [n + W(l, i), a + W(l, i), p[0], p[1]]}), h.push({op: "move", data: [t.x + W(c, i), t.y + W(c, i)]}), p = [o + W(c, i), r + W(c, i)], h.push({
                        op: "qcurveTo",
                        data: [n + W(c, i), a + W(c, i), p[0], p[1]]
                    }), t.setPosition(p[0], p[1]), t.quadReflectionPoint = [o + (o - n), r + (r - a)]
                }
                break
            }
            case"T":
            case"t": {
                const n = "t" === e.key;
                if (e.data.length >= 2) {
                    let a = +e.data[0], o = +e.data[1];
                    n && (a += t.x, o += t.y);
                    let r = a, l = o;
                    const c = s ? s.key : "";
                    let p = null;
                    "q" !== c && "Q" !== c && "t" !== c && "T" !== c || (p = t.quadReflectionPoint), p && (r = p[0], l = p[1]);
                    const u = 1 * (1 + .2 * i.roughness), f = 1.5 * (1 + .22 * i.roughness);
                    h.push({op: "move", data: [t.x + W(u, i), t.y + W(u, i)]});
                    let d = [a + W(u, i), o + W(u, i)];
                    h.push({op: "qcurveTo", data: [r + W(u, i), l + W(u, i), d[0], d[1]]}), h.push({op: "move", data: [t.x + W(f, i), t.y + W(f, i)]}), d = [a + W(f, i), o + W(f, i)], h.push({
                        op: "qcurveTo",
                        data: [r + W(f, i), l + W(f, i), d[0], d[1]]
                    }), t.setPosition(d[0], d[1]), t.quadReflectionPoint = [a + (a - r), o + (o - l)]
                }
                break
            }
            case"A":
            case"a": {
                const s = "a" === e.key;
                if (e.data.length >= 7) {
                    const n = +e.data[0], o = +e.data[1], r = +e.data[2], l = +e.data[3], c = +e.data[4];
                    let p = +e.data[5], u = +e.data[6];
                    if (s && (p += t.x, u += t.y), p === t.x && u === t.y) break;
                    if (0 === n || 0 === o) h = h.concat(R(t.x, t.y, p, u, i)), t.setPosition(p, u); else for (let e = 0; e < 1; e++) {
                        const e = new a([t.x, t.y], [p, u], [n, o], r, !!l, !!c);
                        let s = e.getNextSegment();
                        for (; s;) {
                            const n = B(s.cp1[0], s.cp1[1], s.cp2[0], s.cp2[1], s.to[0], s.to[1], t, i);
                            h = h.concat(n), s = e.getNextSegment()
                        }
                    }
                }
                break
            }
        }
        return h
    }

    class U extends e {
        line(t, e, s, i, h) {
            const n = this._options(h);
            return this._drawable("line", [S(t, e, s, i, n)], n)
        }

        rectangle(t, e, s, i, h) {
            const n = this._options(h), a = [];
            if (n.fill) {
                const h = [[t, e], [t + s, e], [t + s, e + i], [t, e + i]];
                "solid" === n.fillStyle ? a.push(z(h, n)) : a.push(L(h, n))
            }
            return a.push(E(t, e, s, i, n)), this._drawable("rectangle", a, n)
        }

        ellipse(t, e, s, i, h) {
            const n = this._options(h), a = [];
            if (n.fill) if ("solid" === n.fillStyle) {
                const h = T(t, e, s, i, n);
                h.type = "fillPath", a.push(h)
            } else a.push(function (t, e, s, i, h) {
                return P(h, v).fillEllipse(t, e, s, i, h)
            }(t, e, s, i, n));
            return a.push(T(t, e, s, i, n)), this._drawable("ellipse", a, n)
        }

        circle(t, e, s, i) {
            const h = this.ellipse(t, e, s, s, i);
            return h.shape = "circle", h
        }

        linearPath(t, e) {
            const s = this._options(e);
            return this._drawable("linearPath", [A(t, !1, s)], s)
        }

        arc(t, e, s, i, h, n, a = !1, o) {
            const r = this._options(o), l = [];
            if (a && r.fill) if ("solid" === r.fillStyle) {
                const a = C(t, e, s, i, h, n, !0, !1, r);
                a.type = "fillPath", l.push(a)
            } else l.push(function (t, e, s, i, h, n, a) {
                const o = P(a, v).fillArc(t, e, s, i, h, n, a);
                if (o) return o;
                const r = t, l = e;
                let c = Math.abs(s / 2), p = Math.abs(i / 2);
                c += W(.01 * c, a), p += W(.01 * p, a);
                let u = h, f = n;
                for (; u < 0;) u += 2 * Math.PI, f += 2 * Math.PI;
                f - u > 2 * Math.PI && (u = 0, f = 2 * Math.PI);
                const d = (f - u) / a.curveStepCount, g = [];
                for (let t = u; t <= f; t += d) g.push([r + c * Math.cos(t), l + p * Math.sin(t)]);
                return g.push([r + c * Math.cos(f), l + p * Math.sin(f)]), g.push([r, l]), L(g, a)
            }(t, e, s, i, h, n, r));
            return l.push(C(t, e, s, i, h, n, a, !0, r)), this._drawable("arc", l, r)
        }

        curve(t, e) {
            const s = this._options(e);
            return this._drawable("curve", [O(t, s)], s)
        }

        polygon(t, e) {
            const s = this._options(e), i = [];
            if (s.fill) if ("solid" === s.fillStyle) i.push(z(t, s)); else {
                const e = this.computePolygonSize(t), h = L([[0, 0], [e[0], 0], [e[0], e[1]], [0, e[1]]], s);
                h.type = "path2Dpattern", h.size = e, h.path = this.polygonPath(t), i.push(h)
            }
            return i.push(A(t, !0, s)), this._drawable("polygon", i, s)
        }

        path(t, e) {
            const s = this._options(e), i = [];
            if (!t) return this._drawable("path", i, s);
            if (s.fill) if ("solid" === s.fillStyle) {
                const e = {type: "path2Dfill", path: t, ops: []};
                i.push(e)
            } else {
                const e = this.computePathSize(t), h = L([[0, 0], [e[0], 0], [e[0], e[1]], [0, e[1]]], s);
                h.type = "path2Dpattern", h.size = e, h.path = t, i.push(h)
            }
            return i.push(function (t, e) {
                t = (t || "").replace(/\n/g, " ").replace(/(-\s)/g, "-").replace("/(ss)/g", " ");
                let s = new n(t);
                if (e.simplification) {
                    const t = new o(s.linearPoints, s.closed).fit(e.simplification);
                    s = new n(t)
                }
                let i = [];
                const h = s.segments || [];
                for (let t = 0; t < h.length; t++) {
                    const n = X(s, h[t], t > 0 ? h[t - 1] : null, e);
                    n && n.length && (i = i.concat(n))
                }
                return {type: "path", ops: i}
            }(t, s)), this._drawable("path", i, s)
        }
    }

    const V = "undefined" != typeof document;

    class j {
        constructor(t) {
            this.canvas = t, this.ctx = this.canvas.getContext("2d")
        }

        draw(t) {
            const e = t.sets || [], s = t.options || this.getDefaultOptions(), i = this.ctx;
            for (var t of e) switch (t.type) {
                case"path":
                    i.save(), i.strokeStyle = s.stroke, i.lineWidth = s.strokeWidth, this._drawToContext(i, t), i.restore();
                    break;
                case"fillPath":
                    i.save(), i.fillStyle = s.fill || "", this._drawToContext(i, t), i.restore();
                    break;
                case"fillSketch":
                    this.fillSketch(i, t, s);
                    break;
                case"path2Dfill": {
                    this.ctx.save(), this.ctx.fillStyle = s.fill || "";
                    const e = new Path2D(t.path);
                    this.ctx.fill(e), this.ctx.restore();
                    break
                }
                case"path2Dpattern": {
                    const e = this.canvas.ownerDocument || V && document;
                    if (e) {
                        const i = t.size, h = e.createElement("canvas"), n = h.getContext("2d"), a = this.computeBBox(t.path);
                        a && (a.width || a.height) ? (h.width = this.canvas.width, h.height = this.canvas.height, n.translate(a.x || 0, a.y || 0)) : (h.width = i[0], h.height = i[1]), this.fillSketch(n, t, s), this.ctx.save(), this.ctx.fillStyle = this.ctx.createPattern(h, "repeat");
                        const o = new Path2D(t.path);
                        this.ctx.fill(o), this.ctx.restore()
                    } else console.error("Cannot render path2Dpattern. No defs/document defined.");
                    break
                }
            }
        }

        computeBBox(t) {
            if (V) try {
                const e = "http://www.w3.org/2000/svg", s = document.createElementNS(e, "svg");
                s.setAttribute("width", "0"), s.setAttribute("height", "0");
                const i = self.document.createElementNS(e, "path");
                i.setAttribute("d", t), s.appendChild(i), document.body.appendChild(s);
                const h = i.getBBox();
                return document.body.removeChild(s), h
            } catch (t) {
            }
            return null
        }

        fillSketch(t, e, s) {
            let i = s.fillWeight;
            i < 0 && (i = s.strokeWidth / 2), t.save(), t.strokeStyle = s.fill || "", t.lineWidth = i, this._drawToContext(t, e), t.restore()
        }

        _drawToContext(t, e) {
            t.beginPath();
            for (const s of e.ops) {
                const e = s.data;
                switch (s.op) {
                    case"move":
                        t.moveTo(e[0], e[1]);
                        break;
                    case"bcurveTo":
                        t.bezierCurveTo(e[0], e[1], e[2], e[3], e[4], e[5]);
                        break;
                    case"qcurveTo":
                        t.quadraticCurveTo(e[0], e[1], e[2], e[3]);
                        break;
                    case"lineTo":
                        t.lineTo(e[0], e[1])
                }
            }
            "fillPath" === e.type ? t.fill() : t.stroke()
        }
    }

    class F extends j {
        constructor(t, e) {
            super(t), this.gen = new U(e || null, this.canvas)
        }

        get generator() {
            return this.gen
        }

        getDefaultOptions() {
            return this.gen.defaultOptions
        }

        line(t, e, s, i, h) {
            const n = this.gen.line(t, e, s, i, h);
            return this.draw(n), n
        }

        rectangle(t, e, s, i, h) {
            const n = this.gen.rectangle(t, e, s, i, h);
            return this.draw(n), n
        }

        ellipse(t, e, s, i, h) {
            const n = this.gen.ellipse(t, e, s, i, h);
            return this.draw(n), n
        }

        circle(t, e, s, i) {
            const h = this.gen.circle(t, e, s, i);
            return this.draw(h), h
        }

        linearPath(t, e) {
            const s = this.gen.linearPath(t, e);
            return this.draw(s), s
        }

        polygon(t, e) {
            const s = this.gen.polygon(t, e);
            return this.draw(s), s
        }

        arc(t, e, s, i, h, n, a = !1, o) {
            const r = this.gen.arc(t, e, s, i, h, n, a, o);
            return this.draw(r), r
        }

        curve(t, e) {
            const s = this.gen.curve(t, e);
            return this.draw(s), s
        }

        path(t, e) {
            const s = this.gen.path(t, e);
            return this.draw(s), s
        }
    }

    const Q = "undefined" != typeof document;

    class Z {
        constructor(t) {
            this.svg = t
        }

        get defs() {
            const t = this.svg.ownerDocument || Q && document;
            if (t && !this._defs) {
                const e = t.createElementNS("http://www.w3.org/2000/svg", "defs");
                this.svg.firstChild ? this.svg.insertBefore(e, this.svg.firstChild) : this.svg.appendChild(e), this._defs = e
            }
            return this._defs || null
        }

        draw(t) {
            const e = t.sets || [], s = t.options || this.getDefaultOptions(), i = this.svg.ownerDocument || window.document, h = i.createElementNS("http://www.w3.org/2000/svg", "g");
            for (var t of e) {
                let e = null;
                switch (t.type) {
                    case"path":
                        (e = i.createElementNS("http://www.w3.org/2000/svg", "path")).setAttribute("d", this.opsToPath(t)), e.style.stroke = s.stroke, e.style.strokeWidth = s.strokeWidth + "", e.style.fill = "none";
                        break;
                    case"fillPath":
                        (e = i.createElementNS("http://www.w3.org/2000/svg", "path")).setAttribute("d", this.opsToPath(t)), e.style.stroke = "none", e.style.strokeWidth = "0", e.style.fill = s.fill || null;
                        break;
                    case"fillSketch":
                        e = this.fillSketch(i, t, s);
                        break;
                    case"path2Dfill":
                        (e = i.createElementNS("http://www.w3.org/2000/svg", "path")).setAttribute("d", t.path || ""), e.style.stroke = "none", e.style.strokeWidth = "0", e.style.fill = s.fill || null;
                        break;
                    case"path2Dpattern":
                        if (this.defs) {
                            const h = t.size, n = i.createElementNS("http://www.w3.org/2000/svg", "pattern"), a = `rough-${Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER || 999999))}`;
                            n.setAttribute("id", a), n.setAttribute("x", "0"), n.setAttribute("y", "0"), n.setAttribute("width", "1"), n.setAttribute("height", "1"), n.setAttribute("height", "1"), n.setAttribute("viewBox", `0 0 ${Math.round(h[0])} ${Math.round(h[1])}`), n.setAttribute("patternUnits", "objectBoundingBox");
                            const o = this.fillSketch(i, t, s);
                            n.appendChild(o), this.defs.appendChild(n), (e = i.createElementNS("http://www.w3.org/2000/svg", "path")).setAttribute("d", t.path || ""), e.style.stroke = "none", e.style.strokeWidth = "0", e.style.fill = `url(#${a})`
                        } else console.error("Cannot render path2Dpattern. No defs/document defined.")
                }
                e && h.appendChild(e)
            }
            return h
        }

        fillSketch(t, e, s) {
            let i = s.fillWeight;
            i < 0 && (i = s.strokeWidth / 2);
            const h = t.createElementNS("http://www.w3.org/2000/svg", "path");
            return h.setAttribute("d", this.opsToPath(e)), h.style.stroke = s.fill || null, h.style.strokeWidth = i + "", h.style.fill = "none", h
        }
    }

    class H extends Z {
        constructor(t, e) {
            super(t), this.gen = new U(e || null, this.svg)
        }

        get generator() {
            return this.gen
        }

        getDefaultOptions() {
            return this.gen.defaultOptions
        }

        opsToPath(t) {
            return this.gen.opsToPath(t)
        }

        line(t, e, s, i, h) {
            const n = this.gen.line(t, e, s, i, h);
            return this.draw(n)
        }

        rectangle(t, e, s, i, h) {
            const n = this.gen.rectangle(t, e, s, i, h);
            return this.draw(n)
        }

        ellipse(t, e, s, i, h) {
            const n = this.gen.ellipse(t, e, s, i, h);
            return this.draw(n)
        }

        circle(t, e, s, i) {
            const h = this.gen.circle(t, e, s, i);
            return this.draw(h)
        }

        linearPath(t, e) {
            const s = this.gen.linearPath(t, e);
            return this.draw(s)
        }

        polygon(t, e) {
            const s = this.gen.polygon(t, e);
            return this.draw(s)
        }

        arc(t, e, s, i, h, n, a = !1, o) {
            const r = this.gen.arc(t, e, s, i, h, n, a, o);
            return this.draw(r)
        }

        curve(t, e) {
            const s = this.gen.curve(t, e);
            return this.draw(s)
        }

        path(t, e) {
            const s = this.gen.path(t, e);
            return this.draw(s)
        }
    }

    return {canvas: (t, e) => new F(t, e), svg: (t, e) => new H(t, e), generator: (t, e) => new U(t, e)}
}();
