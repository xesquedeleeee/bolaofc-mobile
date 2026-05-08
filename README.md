# BolãoFC — app mobile

Cliente **React Native (Expo)** para bolão de futebol: campeonatos, apostas, ranking e perfil. Os dados vêm da API configurada no projeto.

## Requisitos

- Node.js LTS
- npm (ou yarn/pnpm)
- **Expo Go** no celular (opcional) ou emulador Android / simulador iOS

## Como rodar

```bash
npm install
npm start
```

- **Android:** `npm run android` (emulador ou dispositivo com USB)
- **iOS:** `npm run ios` (somente macOS, Xcode)
- **Web:** `npm run web`

Com o bundler aberto, escaneie o QR no Expo Go ou escolha a plataforma no terminal.

## API

A URL base está em `src/services/api.ts` (padrão: deploy na Vercel). Para outro ambiente, altere `baseURL` e salve.

## Conta e login

1. Cadastro em **Criar conta** (`/auth/register`).
2. Login em **Entrar** (`/auth/login`).
3. O **access token (JWT)** expira em **até 15 minutos**. Depois disso ele deixa de ser válido: é preciso **entrar de novo** para obter um token novo. O app limpa a sessão local quando o prazo acaba, quando a API responde **401** ou ao voltar do segundo plano com token expirado.

> O tempo de vida real do JWT é definido no **backend** (`expiresIn` / `exp`). O app e a documentação assumem **15 minutos**; mantenha o servidor alinhado a isso.

## Estrutura útil

| Caminho                  | Função                                        |
| ------------------------ | --------------------------------------------- |
| `app/`                   | Rotas (Expo Router): abas, auth, telas extras |
| `src/services/api.ts`    | Cliente HTTP + headers de autorização         |
| `src/store/authStore.ts` | Sessão (SecureStore)                          |
| `constants/theme.ts`     | Cores e tema                                  |
