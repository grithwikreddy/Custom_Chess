#include <bits/stdc++.h>
#define BOARD_SIZE 5
using namespace std;

class Board {
public:
    Board();  
    void printBoard();
    bool movePiece(int x1, int y1, int x2, int y2);
    vector<pair<int, int>> getPossibleMoves(int x, int y);
    void play();

private:
    struct Cell {
        char type; 
        char player;
    };

    Cell grid[BOARD_SIZE][BOARD_SIZE];
    char currentPlayer; 

    void setupBoard();
};

Board::Board() {
    currentPlayer = 'A';  
    setupBoard();
}

void Board::setupBoard() {

    grid[0][0] = {'P', 'A'};
    grid[0][1] = {'P', 'A'};
    grid[0][2] = {'1', 'A'};
    grid[0][3] = {'P', 'A'};
    grid[0][4] = {'2', 'A'};
    
    grid[4][0] = {'P', 'B'};
    grid[4][1] = {'P', 'B'};
    grid[4][2] = {'1', 'B'};
    grid[4][3] = {'P', 'B'};
    grid[4][4] = {'2', 'B'};
}

void Board::printBoard() {
    cout << "  0 1 2 3 4" << endl;
    for (int i = 0; i < BOARD_SIZE; i++) {
        cout << i << " ";
        for (int j = 0; j < BOARD_SIZE; j++) {
            if (grid[i][j].player != 'A' && grid[i][j].player!='B') {
                cout << ". ";
            } else {
                cout << grid[i][j].player << grid[i][j].type << " ";
            }
        }
        cout << endl;
    }
}

vector<pair<int, int>> Board::getPossibleMoves(int x, int y) {
    vector<pair<int, int>> moves;
    char pieceType = grid[x][y].type;

    if (pieceType == 'P') {
        
        if (x > 0) moves.push_back({x - 1, y}); 
        if (x < BOARD_SIZE - 1) moves.push_back({x + 1, y}); 
        if (y > 0) moves.push_back({x, y - 1});
        if (y < BOARD_SIZE - 1) moves.push_back({x, y + 1});
    } else if (pieceType == '1') {
        for (int dx = -2; dx <= 2; dx++) {
            for (int dy = -2; dy <= 2; dy++) {
                if (abs(dx) + abs(dy) <= 2 && (dx != 0 || dy != 0)) {
                    int nx = x + dx;
                    int ny = y + dy;
                    if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
                        if (grid[nx][ny].player != grid[x][y].player) {
                            moves.push_back({nx, ny});
                        }
                    }
                }
            }
        }
    } else if (pieceType == '2') {
        // Hero2 moves
        for (int dx = -2; dx <= 2; dx++) {
            for (int dy = -2; dy <= 2; dy++) {
                if (abs(dx) == abs(dy) && abs(dx) == 2) {
                    int nx = x + dx;
                    int ny = y + dy;
                    if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
                        if (grid[nx][ny].player != grid[x][y].player) {
                            moves.push_back({nx, ny});
                        }
                    }
                }
            }
        }
    }

    return moves;
}

bool Board::movePiece(int x1, int y1, int x2, int y2) {
    if (x2 < 0 || x2 >= BOARD_SIZE || y2 < 0 || y2 >= BOARD_SIZE) {
        cout << "Move out of bounds!" << endl;
        return false;
    }
    if (grid[x1][y1].player != currentPlayer) {
        cout << "Not your piece!" << endl;
        return false;
    }
    if (grid[x2][y2].player == currentPlayer) {
        cout << "Cannot move to a cell occupied by your own piece!" << endl;
        return false;
    }

    char pieceType = grid[x1][y1].type;
    bool validMove = false;

    if (pieceType == 'P') {
        if ((x1 == x2 && abs(y1 - y2) == 1) || (y1 == y2 && abs(x1 - x2) == 1)) {
            validMove = true;
        }
    } else if (pieceType == '1') {
        if (abs(x1 - x2) <= 2 && abs(y1 - y2) <= 2) {
            validMove = true;
        }
    } else if (pieceType == '2') {
        if (abs(x1 - x2) == abs(y1 - y2) && abs(x1 - x2) <= 2) {
            validMove = true;
        }
    }

    if (validMove) {
        grid[x2][y2] = grid[x1][y1];
        grid[x1][y1] = {' ', ' '}; 
        return true;
    } else {
        cout << "Invalid move!" << endl;
        return false;
    }
}

void Board::play() {
    while (true) {
        printBoard();
        cout << "Player " << currentPlayer << "'s turn." << endl;

        std::map<int, pair<int, int>> pieceList; 
        int pieceIndex = 1;
        cout << "Choose a piece to move:" << endl;
        for (int i = 0; i < BOARD_SIZE; i++) {
            for (int j = 0; j < BOARD_SIZE; j++) {
                if (grid[i][j].player == currentPlayer) {
                    pieceList[pieceIndex] = {i, j};
                    cout << pieceIndex++ << ". " << grid[i][j].player << grid[i][j].type << " at (" << i << ", " << j << ")" << endl;
                }
            }
        }

        int choice;
        cout << "Enter the number of the piece to move: ";
        cin >> choice;

        if (pieceList.find(choice) == pieceList.end()) {
            cout << "Invalid choice!" << endl;
            continue;
        }

        int x1 = pieceList[choice].first;
        int y1 = pieceList[choice].second;

        vector<pair<int, int>> moves = getPossibleMoves(x1, y1);

        cout << "Possible moves for " << grid[x1][y1].player << grid[x1][y1].type << ":" << endl;
        int moveIndex = 1;
        for (auto move : moves) {
            cout << moveIndex++ << ". (" << move.first << ", " << move.second << ")" << endl;
        }

        int moveChoice;
        cout << "Enter the number of the move to make: ";
        cin >> moveChoice;

        if (moveChoice < 1 || moveChoice >= moveIndex) {
            cout << "Invalid move choice!" << endl;
            continue;
        }

        int x2 = moves[moveChoice - 1].first;
        int y2 = moves[moveChoice - 1].second;

        if (movePiece(x1, y1, x2, y2)) {
            currentPlayer = (currentPlayer == 'A') ? 'B' : 'A';
        }
    }
}

int main() {
    Board board;
    board.play();
    return 0;
}