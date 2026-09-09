# Landing de inauguração — O Campista

Site estático de página única para divulgar o lançamento do app e o sorteio de inauguração.
HTML, CSS e JS puros — **sem build, sem dependências**.

```
landing/
├── index.html
├── assets/
│   ├── styles.css   # tokens copiados de src/styles.scss (mesma identidade do app)
│   ├── main.js      # tema, menu, formulário, compartilhamento, animações
│   └── img/         # logo, background, banner e favicon (cópias de public/)
└── README.md
```

## Rodar localmente

Abra `index.html` no navegador, ou sirva a pasta:

```bash
npx serve landing
```

## O que preencher antes de publicar

Tudo que precisa de valor real está marcado com `TODO` no HTML ou agrupado no topo de
`assets/main.js`.

**`assets/main.js`**

| Constante        | O que é                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `SITE_URL`       | URL pública final do site — usada nos botões de compartilhamento    |
| `SHARE_TEXT`     | Texto que acompanha o link nas redes                                |
| `FORM_ENDPOINT`  | URL que recebe o cadastro (Formspree, Google Form, backend próprio) |
| `FALLBACK_EMAIL` | E-mail usado no `mailto:` quando `FORM_ENDPOINT` está vazio         |

**`index.html`** (procure por `TODO`)

- Links das redes sociais no rodapé (Instagram, TikTok, YouTube, X) — hoje `href="#"`
- Badges de loja: hoje marcados como "Em breve", sem link. Ao publicar, troque cada `<span
class="store-badge">` por um `<a href="...">` e remova o selo `.soon`
- Links legais do rodapé: apontar para as URLs públicas de `/termos` e `/privacidade` do app
- Regulamento do sorteio (texto oficial) e o conteúdo do prêmio na seção `#sorteio`

## Lista de espera sem backend

Com `FORM_ENDPOINT` vazio, o formulário valida os campos e abre o cliente de e-mail do visitante
com os dados preenchidos. Para receber os cadastros de forma automática, crie um formulário no
[Formspree](https://formspree.io) (ou equivalente) e cole a URL em `FORM_ENDPOINT` — o envio é um
`POST` JSON com `{ nome, email }`.

## Publicar

O site está no ar pelo **GitHub Pages**, servido da branch `main` na raiz do repositório:

**https://lipilemos.github.io/o-campista-landing/**

Cada push na `main` republica automaticamente — não há build, os arquivos vão como estão.
O `.nojekyll` desliga o processamento Jekyll do Pages.

Para apontar um domínio próprio: crie os registros DNS no registrador, adicione o domínio em
_Settings → Pages → Custom domain_ e atualize `SITE_URL` em `assets/main.js` e as tags
`canonical`/`og:url`/`og:image`/`twitter:image` em `index.html`.

A pasta é autocontida, então qualquer outro host de estático também serve
(Netlify: arraste a pasta em app.netlify.com/drop; Vercel: `vercel`).

## Trocar os mockups por prints reais

As telas do app na seção "Por dentro do app" são **mockups em HTML/CSS**, construídos com os mesmos
design tokens do app. Cada um vive em:

```html
<div class="phone-frame">
  <div class="phone-screen">…</div>
</div>
```

Para usar um print real, substitua todo o conteúdo de `.phone-screen` por uma imagem — o CSS já
cuida do recorte e do arredondamento:

```html
<div class="phone-frame">
  <div class="phone-screen">
    <img src="assets/img/tela-mapa.png" alt="Tela do mapa do O Campista" />
  </div>
</div>
```

Prints sugeridos (proporção 9:19, ex.: 1080×2280): Mapa · Check-in · Clima · Presente · Chat ·
Conquistas.

## Manutenção visual

`assets/styles.css` é uma **cópia** dos tokens de `src/styles.scss`. Se a paleta, a tipografia ou
os raios mudarem no app, replique aqui para que a landing continue idêntica ao produto. A
referência viva dos padrões é a rota `/design-system` do app (`npm start`).
