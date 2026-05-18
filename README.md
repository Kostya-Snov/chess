# Chess

The repository of the chess project.

## Demo

### Online gameplay

https://github.com/user-attachments/assets/b794f7ce-00b6-40e9-9c69-92f1e5459165

### Move history

https://github.com/user-attachments/assets/1f52bbd8-5178-4a18-903f-1471bf87170d

### Special moves

https://github.com/user-attachments/assets/4217b65b-aac7-44ec-af05-41f7c2147c0a

### Adaptive layout

https://github.com/user-attachments/assets/db95b057-162d-4d1c-990b-b8d8d3c1afe3

### Color themes

https://github.com/user-attachments/assets/fff04ead-9657-4048-aa1d-c48ac731c897

## Used

- [React](https://github.com/facebook/react)
- [Next.js](https://github.com/vercel/next.js)
- [Sass](https://github.com/sass/sass) (SCSS)
- [ws](https://github.com/websockets/ws)
- [winston](https://github.com/winstonjs/winston)

## Getting started

- Set up the packages by running the [setup.sh](setup.sh) script.
- Start the server from the [chess-server](chess-server) directory using the `npm start` command.
- Start the client from the [chess-client](chess-client) directory using the `npm run dev` command.
- Open http://localhost:3000 in a browser to see a result.

## Main packages

### Client

The client of the chess game.

#### Features

- Supports both offline and online gameplay.
- Allows browsing the move history of the current chess game.
- Drag and drop for moving pieces.
- Real-time communication with the server using WebSockets.
- Adaptive layout.
- Supports dark, light and system color themes.
- Saves UI-specific settings in cookies.
- Heuristically tracks the zoom value needed to fit the chessboard in the viewport at 100% zoom.

### Chess server

The server for processing chess games.

#### Features

- Interacts via WebSockets.
- Automatically creates a new chess game when two players connect.
- Logs operations.
- Handles player disconnection.
- Handles and responds to invalid requests.

### Chess engine

The package providing the chess game API.

#### Features

- Gets the legal moves for a piece. All special moves are supported: en passant, castling, and pawn
  promotion.
- Checks whether the king is in check.
- Represents a position on the chessboard using branded types.
- Validates operations and throws an error if they are invalid.
