import type { SVG } from './types'

// <?xml version="1.0" encoding="utf-8"?>
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
//   <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"/>
// </svg>

export default {
    attributes: {
        viewBox: '0 0 36 36'
    },
    source: `<path fill="#3B88C3" d="M0 4c0-4 4-4 4-4h28s4 0 4 4v28s0 4-4 4H4s-4 0-4-4V4z"/><ellipse fill="#FFF" cx="23" cy="7.5" rx="3" ry="3.5"/><path fill="#FFF" d="M29 13s0-2-2-2h-7c-1 0-2 1-2 1l-2 2h-4s-1 0-1 1 1 1 1 1h5l2-2v17s0 1 1 1h1s1 0 1-1v-8s0-1 1-1 1 1 1 1v8s0 1 1 1h1s1 0 1-1v-9s2 0 2-2v-7z"/><path fill="#FFF" d="M6 22s-1 0-1-1 1-1 1-1 2 0 2 2v8h6v-8c0-2 2-2 2-2s1 0 1 1-1 1-1 1v8s0 2-2 2H8s-2 0-2-2v-8z"/><circle fill="#FFF" cx="11" cy="20" r="2"/>`
} as SVG