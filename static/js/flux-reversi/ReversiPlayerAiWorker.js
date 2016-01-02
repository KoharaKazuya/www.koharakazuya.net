(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  Empty: 0,
  White: 1,
  Black: 2
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CellToken = require('../constants/CellToken');

var _CellToken2 = _interopRequireDefault(_CellToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReversiEvalMachine = {
  /**
   * 指定した手番の人の得点を計算する
   * 得点: 自分の色のコマの数
   *
   * @param {Array<Array<Number>>} cells 盤面を示す２次元配列
   * @param {CellToken} 手番の人を示すコマ
   * @return {Number} 得点
   */

  getScoreFor: function getScoreFor(cells, token) {
    var flattenCells = Array.prototype.concat.apply([], cells); // flatten
    return flattenCells.filter(function (cell) {
      return cell === token;
    }).length;
  },

  /**
   * 白なら黒、黒なら白のコマを返す
   *
   * @param {CellToken} token コマ
   * @return {CellToken} 逆のコマ
   */
  reversedToken: function reversedToken(token) {
    return token !== _CellToken2.default.Black ? _CellToken2.default.Black : _CellToken2.default.White;
  },

  /**
   * 指定したマスにコマを置いたら反転されるマスの一覧を取得する
   *
   * @param {Array<Array<Number>>} cells 盤面を示す２次元配列
   * @param {Number} x 左から数えてマスの位置
   * @param {Number} y 上から数えてマスの位置
   * @param {CellToken} token コマ
   * @return {Array<Object>} マスの位置を {x, y} で表した配列
   */
  effectedCells: function effectedCells(cells, x, y, token) {
    var reversed = ReversiEvalMachine.reversedToken(token);

    function effectedLine(dx, dy) {
      var tx = x + dx;
      var ty = y + dy;

      var line = [];
      // 隣接したマスが連続して逆のコマなら追加
      while (cells[ty] && cells[ty][tx] === reversed) {
        line.push({ x: tx, y: ty });
        var _ref = [tx + dx, ty + dy];
        tx = _ref[0];
        ty = _ref[1];
      }
      // 挟めていなければ追加しない
      if (!(cells[ty] && cells[ty][tx] === token)) {
        line = [];
      }

      return line;
    }

    var effectedCells = [];
    effectedCells = effectedCells.concat(effectedLine(-1, -1));
    effectedCells = effectedCells.concat(effectedLine(-1, 0));
    effectedCells = effectedCells.concat(effectedLine(-1, 1));
    effectedCells = effectedCells.concat(effectedLine(0, -1));
    effectedCells = effectedCells.concat(effectedLine(0, 1));
    effectedCells = effectedCells.concat(effectedLine(1, -1));
    effectedCells = effectedCells.concat(effectedLine(1, 0));
    effectedCells = effectedCells.concat(effectedLine(1, 1));
    return effectedCells;
  },

  /**
   * 指定したマスにコマを置いた場合の次の盤面を返す
   *
   * @param {Array<Array<Number>>} cells 盤面を示す２次元配列
   * @param {Number} x 左から数えてマスの位置
   * @param {Number} y 上から数えてマスの位置
   * @param {CellToken} token 置くコマ
   * @return {Array<Array<Number>>} 次の盤面を示す２次元配列
   */
  getNextCellsAfterPuttingInto: function getNextCellsAfterPuttingInto(cells, x, y, token) {
    var nextCells = JSON.parse(JSON.stringify(cells));
    if (!ReversiEvalMachine.canPutInto(cells, x, y, token)) {
      // 指定されたマスに置けない場合は、盤面は変わらない
      return nextCells;
    }

    nextCells[y][x] = token;
    var effected = ReversiEvalMachine.effectedCells(cells, x, y, token);
    for (var i = 0; i < effected.length; i++) {
      var cell = effected[i];
      nextCells[cell.y][cell.x] = token;
    }
    return nextCells;
  },

  /**
   * 指定したマスにコマを置けるかどうか判定する
   *
   * @param {Array<Array<Number>>} cells 盤面を示す２次元配列
   * @param {Number} x 左から数えてマスの位置
   * @param {Number} y 上から数えてマスの位置
   * @param {CellToken} token 置けるかどうか判定するコマ
   * @return {Boolean} 置ける場合は true / 置けない場合は false
   */
  canPutInto: function canPutInto(cells, x, y, token) {
    return cells[y][x] === _CellToken2.default.Empty && ReversiEvalMachine.effectedCells(cells, x, y, token).length > 0;
  },

  /**
   * 指定した手番の人が次に置けるマスが一つでも存在するかどうか
   *
   * @param {Array<Array<Number>>} cells 盤面を示す２次元配列
   * @param {CellToken} token 次の手番の人の色を示すコマ
   * @return {Boolean} 存在するなら true / 存在しないなら false
   */
  hasPuttableCell: function hasPuttableCell(cells, token) {
    for (var y = 0; y < cells.length; y++) {
      for (var x = 0; x < cells[y].length; x++) {
        if (ReversiEvalMachine.canPutInto(cells, x, y, token)) {
          return true;
        }
      }
    }
    return false;
  },

  /**
   * 残り空きマス数
   *
   * @param {Array<Array<Number>>} cells 盤面を示す２次元配列
   * @return {Number} 空きマス数
   */
  getNumOfEmpty: function getNumOfEmpty(cells) {
    var count = 0;
    for (var y = 0; y < cells.length; y++) {
      for (var x = 0; x < cells[y].length; x++) {
        if (cells[y][x] === _CellToken2.default.Empty) {
          count += 1;
        }
      }
    }
    return count;
  },

  /**
   * 空きマスが一つでもあるか
   *
   * @param {Array<Array<Number>>} cells 盤面を示す２次元配列
   * @return {Boolean} 空きマスがあれば true / なければ false
   */
  hasEmptyCell: function hasEmptyCell(cells) {
    for (var y = 0; y < cells.length; y++) {
      for (var x = 0; x < cells[y].length; x++) {
        if (cells[y][x] === _CellToken2.default.Empty) {
          return true;
        }
      }
    }
    return false;
  }
};

exports.default = ReversiEvalMachine;

},{"../constants/CellToken":1}],3:[function(require,module,exports){
'use strict';

var _ReversiEvalMachine = require('./ReversiEvalMachine');

var _ReversiEvalMachine2 = _interopRequireDefault(_ReversiEvalMachine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var weight = [[120, -20, 20, 5, 5, 20, -20, 120], [-20, -40, -5, -5, -5, -5, -40, -20], [20, -5, 15, 3, 3, 15, -5, 20], [5, -5, 3, 3, 3, 3, -5, 5], [5, -5, 3, 3, 3, 3, -5, 5], [20, -5, 15, 3, 3, 15, -5, 20], [-20, -40, -5, -5, -5, -5, -40, -20], [120, -20, 20, 5, 5, 20, -20, 120]];

self.onmessage = function (e) {
  var _e$data = e.data;
  var cells = _e$data.cells;
  var token = _e$data.token;
  var depth = _e$data.depth;

  var action = minMax(cells, token, depth).action;
  self.postMessage(action);
};

/**
 * 盤面の得点評価関数
 *
 * @param {Array<Array<Number>>} cells 盤面を示す２次元配列
 * @param {CellToken} 得点を評価したいコマの色
 * @return {Number} 得点
 */
function evalScore(estimatedCells, token) {
  // 与えられた盤面に空きマスがなければ、重み付け関係なしにコマ数だけの評価をする
  if (!_ReversiEvalMachine2.default.hasEmptyCell(estimatedCells)) {
    // flatten
    var flattenCells = Array.prototype.concat.apply([], estimatedCells);
    var numOfToken = flattenCells.filter(function (cell) {
      return cell === token;
    }).length;
    return numOfToken * 10000; // 以下の評価と比較された場合、以下の評価を無視するために十分大きくする
  }

  var score = 0;
  var reversed = _ReversiEvalMachine2.default.reversedToken(token);
  for (var y = 0; y < estimatedCells.length; y++) {
    for (var x = 0; x < estimatedCells[y].length; x++) {
      if (estimatedCells[y][x] === token) {
        score += weight[y][x];
      } else if (estimatedCells[y][x] === reversed) {
        score -= weight[y][x];
      }
    }
  }
  return score;
}

function minMax(cells, token, depth) {
  if (depth === 0) {
    return {
      action: undefined,
      score: evalScore(cells, token)
    };
  }

  var reversed = _ReversiEvalMachine2.default.reversedToken(token);
  var bestAction = {
    action: undefined,
    score: Number.NEGATIVE_INFINITY
  };
  for (var y = 0; y < cells.length; y++) {
    for (var x = 0; x < cells[y].length; x++) {
      if (!_ReversiEvalMachine2.default.canPutInto(cells, x, y, token)) {
        continue;
      }

      var nextCells = _ReversiEvalMachine2.default.getNextCellsAfterPuttingInto(cells, x, y, token);
      var score = -minMax(nextCells, reversed, depth - 1).score;
      if (score > bestAction.score) {
        var action = { x: x, y: y };
        bestAction = { action: action, score: score };
      }
    }
  }

  // パスの場合は評価値として現在の盤面のスコアを返す
  if (bestAction.action === undefined) {
    return {
      action: undefined,
      score: evalScore(cells, token)
    };
  }

  return bestAction;
}

},{"./ReversiEvalMachine":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uc3RhbnRzL0NlbGxUb2tlbi5qcyIsInNyYy9zdG9yZXMvUmV2ZXJzaUV2YWxNYWNoaW5lLmpzIiwic3JjL3N0b3Jlcy9SZXZlcnNpUGxheWVyQWlXb3JrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztrQkNBZTtBQUNiLE9BQUssRUFBRSxDQUFDO0FBQ1IsT0FBSyxFQUFFLENBQUM7QUFDUixPQUFLLEVBQUUsQ0FBQztDQUNUOzs7Ozs7Ozs7Ozs7Ozs7QUNGRCxJQUFNLGtCQUFrQixHQUFHOzs7Ozs7Ozs7O0FBU3pCLGFBQVcsdUJBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUN4QixRQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQztBQUFDLEFBQzdELFdBQU8sWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUk7YUFBSyxJQUFJLEtBQUssS0FBSztLQUFBLENBQUMsQ0FBQyxNQUFNLENBQUM7R0FDN0Q7Ozs7Ozs7O0FBUUQsZUFBYSx5QkFBQyxLQUFLLEVBQUU7QUFDbkIsV0FBTyxLQUFLLEtBQUssb0JBQVUsS0FBSyxHQUFHLG9CQUFVLEtBQUssR0FBRyxvQkFBVSxLQUFLLENBQUM7R0FDdEU7Ozs7Ozs7Ozs7O0FBV0QsZUFBYSx5QkFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUU7QUFDaEMsUUFBTSxRQUFRLEdBQUcsa0JBQWtCLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV6RCxhQUFTLFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFO1VBQ3ZCLEVBQUUsR0FBUyxDQUFDLEdBQUcsRUFBRTtVQUFiLEVBQUUsR0FBYSxDQUFDLEdBQUcsRUFBRTs7QUFDOUIsVUFBSSxJQUFJLEdBQUcsRUFBRTs7QUFBQyxB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Q0FBQztBQUNGLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3JDLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3hDLFVBQUksQ0FBRSw2QkFBbUIsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQ3ZELGlCQUFTO09BQ1Y7O0FBRUQsVUFBTSxTQUFTLEdBQUcsNkJBQW1CLDRCQUE0QixDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3RGLFVBQU0sS0FBSyxHQUFHLENBQUMsQUFBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUUsS0FBSyxDQUFDO0FBQzlELFVBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFDNUIsWUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUQsQ0FBQyxFQUFFLENBQUMsRUFBRCxDQUFDLEVBQUUsQ0FBQztBQUN4QixrQkFBVSxHQUFHLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLENBQUM7T0FDaEM7S0FDRjtHQUNGOzs7QUFBQSxBQUdELE1BQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7QUFDbkMsV0FBTztBQUNMLFlBQU0sRUFBRSxTQUFTO0FBQ2pCLFdBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztLQUMvQixDQUFDO0dBQ0g7O0FBRUQsU0FBTyxVQUFVLENBQUM7Q0FDbkIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQge1xuICBFbXB0eTogMCxcbiAgV2hpdGU6IDEsXG4gIEJsYWNrOiAyLFxufTtcbiIsImltcG9ydCBDZWxsVG9rZW4gZnJvbSAnLi4vY29uc3RhbnRzL0NlbGxUb2tlbic7XG5cbmNvbnN0IFJldmVyc2lFdmFsTWFjaGluZSA9IHtcbiAgLyoqXG4gICAqIOaMh+WumuOBl+OBn+aJi+eVquOBruS6uuOBruW+l+eCueOCkuioiOeul+OBmeOCi1xuICAgKiDlvpfngrk6IOiHquWIhuOBruiJsuOBruOCs+ODnuOBruaVsFxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PEFycmF5PE51bWJlcj4+fSBjZWxscyDnm6TpnaLjgpLnpLrjgZnvvJLmrKHlhYPphY3liJdcbiAgICogQHBhcmFtIHtDZWxsVG9rZW59IOaJi+eVquOBruS6uuOCkuekuuOBmeOCs+ODnlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IOW+l+eCuVxuICAgKi9cbiAgZ2V0U2NvcmVGb3IoY2VsbHMsIHRva2VuKSB7XG4gICAgY29uc3QgZmxhdHRlbkNlbGxzID0gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgY2VsbHMpOyAgLy8gZmxhdHRlblxuICAgIHJldHVybiBmbGF0dGVuQ2VsbHMuZmlsdGVyKChjZWxsKSA9PiBjZWxsID09PSB0b2tlbikubGVuZ3RoO1xuICB9LFxuXG4gIC8qKlxuICAgKiDnmb3jgarjgonpu5LjgIHpu5Ljgarjgonnmb3jga7jgrPjg57jgpLov5TjgZlcbiAgICpcbiAgICogQHBhcmFtIHtDZWxsVG9rZW59IHRva2VuIOOCs+ODnlxuICAgKiBAcmV0dXJuIHtDZWxsVG9rZW59IOmAhuOBruOCs+ODnlxuICAgKi9cbiAgcmV2ZXJzZWRUb2tlbih0b2tlbikge1xuICAgIHJldHVybiB0b2tlbiAhPT0gQ2VsbFRva2VuLkJsYWNrID8gQ2VsbFRva2VuLkJsYWNrIDogQ2VsbFRva2VuLldoaXRlO1xuICB9LFxuXG4gIC8qKlxuICAgKiDmjIflrprjgZfjgZ/jg57jgrnjgavjgrPjg57jgpLnva7jgYTjgZ/jgonlj43ou6LjgZXjgozjgovjg57jgrnjga7kuIDopqfjgpLlj5blvpfjgZnjgotcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxBcnJheTxOdW1iZXI+Pn0gY2VsbHMg55uk6Z2i44KS56S644GZ77yS5qyh5YWD6YWN5YiXXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4IOW3puOBi+OCieaVsOOBiOOBpuODnuOCueOBruS9jee9rlxuICAgKiBAcGFyYW0ge051bWJlcn0geSDkuIrjgYvjgonmlbDjgYjjgabjg57jgrnjga7kvY3nva5cbiAgICogQHBhcmFtIHtDZWxsVG9rZW59IHRva2VuIOOCs+ODnlxuICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fSDjg57jgrnjga7kvY3nva7jgpIge3gsIHl9IOOBp+ihqOOBl+OBn+mFjeWIl1xuICAgKi9cbiAgZWZmZWN0ZWRDZWxscyhjZWxscywgeCwgeSwgdG9rZW4pIHtcbiAgICBjb25zdCByZXZlcnNlZCA9IFJldmVyc2lFdmFsTWFjaGluZS5yZXZlcnNlZFRva2VuKHRva2VuKTtcblxuICAgIGZ1bmN0aW9uIGVmZmVjdGVkTGluZShkeCwgZHkpIHtcbiAgICAgIGxldCBbdHgsIHR5XSA9IFt4ICsgZHgsIHkgKyBkeV07XG4gICAgICBsZXQgbGluZSA9IFtdO1xuICAgICAgLy8g6Zqj5o6l44GX44Gf44Oe44K544GM6YCj57aa44GX44Gm6YCG44Gu44Kz44Oe44Gq44KJ6L+95YqgXG4gICAgICB3aGlsZSAoY2VsbHNbdHldICYmIGNlbGxzW3R5XVt0eF0gPT09IHJldmVyc2VkKSB7XG4gICAgICAgIGxpbmUucHVzaCh7IHg6IHR4LCB5OiB0eSB9KTtcbiAgICAgICAgW3R4LCB0eV0gPSBbdHggKyBkeCwgdHkgKyBkeV07XG4gICAgICB9XG4gICAgICAvLyDmjJ/jgoHjgabjgYTjgarjgZHjgozjgbDov73liqDjgZfjgarjgYRcbiAgICAgIGlmICghKGNlbGxzW3R5XSAmJiBjZWxsc1t0eV1bdHhdID09PSB0b2tlbikpIHtcbiAgICAgICAgbGluZSA9IFtdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbGluZTtcbiAgICB9XG5cbiAgICBsZXQgZWZmZWN0ZWRDZWxscyA9IFtdO1xuICAgIGVmZmVjdGVkQ2VsbHMgPSBlZmZlY3RlZENlbGxzLmNvbmNhdChlZmZlY3RlZExpbmUoLTEsIC0xKSk7XG4gICAgZWZmZWN0ZWRDZWxscyA9IGVmZmVjdGVkQ2VsbHMuY29uY2F0KGVmZmVjdGVkTGluZSgtMSwgMCkpO1xuICAgIGVmZmVjdGVkQ2VsbHMgPSBlZmZlY3RlZENlbGxzLmNvbmNhdChlZmZlY3RlZExpbmUoLTEsIDEpKTtcbiAgICBlZmZlY3RlZENlbGxzID0gZWZmZWN0ZWRDZWxscy5jb25jYXQoZWZmZWN0ZWRMaW5lKDAsIC0xKSk7XG4gICAgZWZmZWN0ZWRDZWxscyA9IGVmZmVjdGVkQ2VsbHMuY29uY2F0KGVmZmVjdGVkTGluZSgwLCAxKSk7XG4gICAgZWZmZWN0ZWRDZWxscyA9IGVmZmVjdGVkQ2VsbHMuY29uY2F0KGVmZmVjdGVkTGluZSgxLCAtMSkpO1xuICAgIGVmZmVjdGVkQ2VsbHMgPSBlZmZlY3RlZENlbGxzLmNvbmNhdChlZmZlY3RlZExpbmUoMSwgMCkpO1xuICAgIGVmZmVjdGVkQ2VsbHMgPSBlZmZlY3RlZENlbGxzLmNvbmNhdChlZmZlY3RlZExpbmUoMSwgMSkpO1xuICAgIHJldHVybiBlZmZlY3RlZENlbGxzO1xuICB9LFxuXG4gIC8qKlxuICAgKiDmjIflrprjgZfjgZ/jg57jgrnjgavjgrPjg57jgpLnva7jgYTjgZ/loLTlkIjjga7mrKHjga7nm6TpnaLjgpLov5TjgZlcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxBcnJheTxOdW1iZXI+Pn0gY2VsbHMg55uk6Z2i44KS56S644GZ77yS5qyh5YWD6YWN5YiXXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4IOW3puOBi+OCieaVsOOBiOOBpuODnuOCueOBruS9jee9rlxuICAgKiBAcGFyYW0ge051bWJlcn0geSDkuIrjgYvjgonmlbDjgYjjgabjg57jgrnjga7kvY3nva5cbiAgICogQHBhcmFtIHtDZWxsVG9rZW59IHRva2VuIOe9ruOBj+OCs+ODnlxuICAgKiBAcmV0dXJuIHtBcnJheTxBcnJheTxOdW1iZXI+Pn0g5qyh44Gu55uk6Z2i44KS56S644GZ77yS5qyh5YWD6YWN5YiXXG4gICAqL1xuICBnZXROZXh0Q2VsbHNBZnRlclB1dHRpbmdJbnRvKGNlbGxzLCB4LCB5LCB0b2tlbikge1xuICAgIGNvbnN0IG5leHRDZWxscyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY2VsbHMpKTtcbiAgICBpZiAoISBSZXZlcnNpRXZhbE1hY2hpbmUuY2FuUHV0SW50byhjZWxscywgeCwgeSwgdG9rZW4pKSB7XG4gICAgICAvLyDmjIflrprjgZXjgozjgZ/jg57jgrnjgavnva7jgZHjgarjgYTloLTlkIjjga/jgIHnm6TpnaLjga/lpInjgo/jgonjgarjgYRcbiAgICAgIHJldHVybiBuZXh0Q2VsbHM7XG4gICAgfVxuXG4gICAgbmV4dENlbGxzW3ldW3hdID0gdG9rZW47XG4gICAgY29uc3QgZWZmZWN0ZWQgPSBSZXZlcnNpRXZhbE1hY2hpbmUuZWZmZWN0ZWRDZWxscyhjZWxscywgeCwgeSwgdG9rZW4pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWZmZWN0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBlZmZlY3RlZFtpXTtcbiAgICAgIG5leHRDZWxsc1tjZWxsLnldW2NlbGwueF0gPSB0b2tlbjtcbiAgICB9XG4gICAgcmV0dXJuIG5leHRDZWxscztcbiAgfSxcblxuICAvKipcbiAgICog5oyH5a6a44GX44Gf44Oe44K544Gr44Kz44Oe44KS572u44GR44KL44GL44Gp44GG44GL5Yik5a6a44GZ44KLXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8QXJyYXk8TnVtYmVyPj59IGNlbGxzIOebpOmdouOCkuekuuOBme+8kuasoeWFg+mFjeWIl1xuICAgKiBAcGFyYW0ge051bWJlcn0geCDlt6bjgYvjgonmlbDjgYjjgabjg57jgrnjga7kvY3nva5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkg5LiK44GL44KJ5pWw44GI44Gm44Oe44K544Gu5L2N572uXG4gICAqIEBwYXJhbSB7Q2VsbFRva2VufSB0b2tlbiDnva7jgZHjgovjgYvjganjgYbjgYvliKTlrprjgZnjgovjgrPjg55cbiAgICogQHJldHVybiB7Qm9vbGVhbn0g572u44GR44KL5aC05ZCI44GvIHRydWUgLyDnva7jgZHjgarjgYTloLTlkIjjga8gZmFsc2VcbiAgICovXG4gIGNhblB1dEludG8oY2VsbHMsIHgsIHksIHRva2VuKSB7XG4gICAgcmV0dXJuIGNlbGxzW3ldW3hdID09PSBDZWxsVG9rZW4uRW1wdHlcbiAgICAgICAgJiYgUmV2ZXJzaUV2YWxNYWNoaW5lLmVmZmVjdGVkQ2VsbHMoY2VsbHMsIHgsIHksIHRva2VuKS5sZW5ndGggPiAwO1xuICB9LFxuXG4gIC8qKlxuICAgKiDmjIflrprjgZfjgZ/miYvnlarjga7kurrjgYzmrKHjgavnva7jgZHjgovjg57jgrnjgYzkuIDjgaTjgafjgoLlrZjlnKjjgZnjgovjgYvjganjgYbjgYtcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxBcnJheTxOdW1iZXI+Pn0gY2VsbHMg55uk6Z2i44KS56S644GZ77yS5qyh5YWD6YWN5YiXXG4gICAqIEBwYXJhbSB7Q2VsbFRva2VufSB0b2tlbiDmrKHjga7miYvnlarjga7kurrjga7oibLjgpLnpLrjgZnjgrPjg55cbiAgICogQHJldHVybiB7Qm9vbGVhbn0g5a2Y5Zyo44GZ44KL44Gq44KJIHRydWUgLyDlrZjlnKjjgZfjgarjgYTjgarjgokgZmFsc2VcbiAgICovXG4gIGhhc1B1dHRhYmxlQ2VsbChjZWxscywgdG9rZW4pIHtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGNlbGxzLmxlbmd0aDsgeSsrKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNlbGxzW3ldLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgIGlmIChSZXZlcnNpRXZhbE1hY2hpbmUuY2FuUHV0SW50byhjZWxscywgeCwgeSwgdG9rZW4pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiDmrovjgornqbrjgY3jg57jgrnmlbBcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxBcnJheTxOdW1iZXI+Pn0gY2VsbHMg55uk6Z2i44KS56S644GZ77yS5qyh5YWD6YWN5YiXXG4gICAqIEByZXR1cm4ge051bWJlcn0g56m644GN44Oe44K55pWwXG4gICAqL1xuICBnZXROdW1PZkVtcHR5KGNlbGxzKSB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGNlbGxzLmxlbmd0aDsgeSsrKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNlbGxzW3ldLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgIGlmIChjZWxsc1t5XVt4XSA9PT0gQ2VsbFRva2VuLkVtcHR5KSB7XG4gICAgICAgICAgY291bnQgKz0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOepuuOBjeODnuOCueOBjOS4gOOBpOOBp+OCguOBguOCi+OBi1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PEFycmF5PE51bWJlcj4+fSBjZWxscyDnm6TpnaLjgpLnpLrjgZnvvJLmrKHlhYPphY3liJdcbiAgICogQHJldHVybiB7Qm9vbGVhbn0g56m644GN44Oe44K544GM44GC44KM44GwIHRydWUgLyDjgarjgZHjgozjgbAgZmFsc2VcbiAgICovXG4gIGhhc0VtcHR5Q2VsbChjZWxscykge1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgY2VsbHMubGVuZ3RoOyB5KyspIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgY2VsbHNbeV0ubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgaWYgKGNlbGxzW3ldW3hdID09PSBDZWxsVG9rZW4uRW1wdHkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZXZlcnNpRXZhbE1hY2hpbmU7XG4iLCJpbXBvcnQgUmV2ZXJzaUV2YWxNYWNoaW5lIGZyb20gJy4vUmV2ZXJzaUV2YWxNYWNoaW5lJztcblxuY29uc3Qgd2VpZ2h0ID0gW1xuICBbMTIwLCAtMjAsIDIwLCA1LCA1LCAyMCwgLTIwLCAxMjBdLFxuICBbLTIwLCAtNDAsIC01LCAtNSwgLTUsIC01LCAtNDAsIC0yMF0sXG4gIFsyMCwgLTUsIDE1LCAzLCAzLCAxNSwgLTUsIDIwXSxcbiAgWzUsIC01LCAzLCAzLCAzLCAzLCAtNSwgNV0sXG4gIFs1LCAtNSwgMywgMywgMywgMywgLTUsIDVdLFxuICBbMjAsIC01LCAxNSwgMywgMywgMTUsIC01LCAyMF0sXG4gIFstMjAsIC00MCwgLTUsIC01LCAtNSwgLTUsIC00MCwgLTIwXSxcbiAgWzEyMCwgLTIwLCAyMCwgNSwgNSwgMjAsIC0yMCwgMTIwXSxcbl07XG5cbnNlbGYub25tZXNzYWdlID0gKGUpID0+IHtcbiAgY29uc3QgeyBjZWxscywgdG9rZW4sIGRlcHRoIH0gPSBlLmRhdGE7XG4gIGNvbnN0IGFjdGlvbiA9IG1pbk1heChjZWxscywgdG9rZW4sIGRlcHRoKS5hY3Rpb247XG4gIHNlbGYucG9zdE1lc3NhZ2UoYWN0aW9uKTtcbn07XG5cbi8qKlxuICog55uk6Z2i44Gu5b6X54K56KmV5L6h6Zai5pWwXG4gKlxuICogQHBhcmFtIHtBcnJheTxBcnJheTxOdW1iZXI+Pn0gY2VsbHMg55uk6Z2i44KS56S644GZ77yS5qyh5YWD6YWN5YiXXG4gKiBAcGFyYW0ge0NlbGxUb2tlbn0g5b6X54K544KS6KmV5L6h44GX44Gf44GE44Kz44Oe44Gu6ImyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IOW+l+eCuVxuICovXG5mdW5jdGlvbiBldmFsU2NvcmUoZXN0aW1hdGVkQ2VsbHMsIHRva2VuKSB7XG4gIC8vIOS4juOBiOOCieOCjOOBn+ebpOmdouOBq+epuuOBjeODnuOCueOBjOOBquOBkeOCjOOBsOOAgemHjeOBv+S7mOOBkemWouS/guOBquOBl+OBq+OCs+ODnuaVsOOBoOOBkeOBruipleS+oeOCkuOBmeOCi1xuICBpZiAoISBSZXZlcnNpRXZhbE1hY2hpbmUuaGFzRW1wdHlDZWxsKGVzdGltYXRlZENlbGxzKSkge1xuICAgIC8vIGZsYXR0ZW5cbiAgICBjb25zdCBmbGF0dGVuQ2VsbHMgPSBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBlc3RpbWF0ZWRDZWxscyk7XG4gICAgY29uc3QgbnVtT2ZUb2tlbiA9IGZsYXR0ZW5DZWxscy5maWx0ZXIoKGNlbGwpID0+IGNlbGwgPT09IHRva2VuKS5sZW5ndGg7XG4gICAgcmV0dXJuIG51bU9mVG9rZW4gKiAxMDAwMDsgIC8vIOS7peS4i+OBruipleS+oeOBqOavlOi8g+OBleOCjOOBn+WgtOWQiOOAgeS7peS4i+OBruipleS+oeOCkueEoeimluOBmeOCi+OBn+OCgeOBq+WNgeWIhuWkp+OBjeOBj+OBmeOCi1xuICB9XG5cbiAgbGV0IHNjb3JlID0gMDtcbiAgY29uc3QgcmV2ZXJzZWQgPSBSZXZlcnNpRXZhbE1hY2hpbmUucmV2ZXJzZWRUb2tlbih0b2tlbik7XG4gIGZvciAobGV0IHkgPSAwOyB5IDwgZXN0aW1hdGVkQ2VsbHMubGVuZ3RoOyB5KyspIHtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGVzdGltYXRlZENlbGxzW3ldLmxlbmd0aDsgeCsrKSB7XG4gICAgICBpZiAoZXN0aW1hdGVkQ2VsbHNbeV1beF0gPT09IHRva2VuKSB7XG4gICAgICAgIHNjb3JlICs9IHdlaWdodFt5XVt4XTtcbiAgICAgIH0gZWxzZSBpZiAoZXN0aW1hdGVkQ2VsbHNbeV1beF0gPT09IHJldmVyc2VkKSB7XG4gICAgICAgIHNjb3JlIC09IHdlaWdodFt5XVt4XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNjb3JlO1xufVxuXG5mdW5jdGlvbiBtaW5NYXgoY2VsbHMsIHRva2VuLCBkZXB0aCkge1xuICBpZiAoZGVwdGggPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWN0aW9uOiB1bmRlZmluZWQsXG4gICAgICBzY29yZTogZXZhbFNjb3JlKGNlbGxzLCB0b2tlbiksXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHJldmVyc2VkID0gUmV2ZXJzaUV2YWxNYWNoaW5lLnJldmVyc2VkVG9rZW4odG9rZW4pO1xuICBsZXQgYmVzdEFjdGlvbiA9IHtcbiAgICBhY3Rpb246IHVuZGVmaW5lZCxcbiAgICBzY29yZTogTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZLFxuICB9O1xuICBmb3IgKGxldCB5ID0gMDsgeSA8IGNlbGxzLmxlbmd0aDsgeSsrKSB7XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBjZWxsc1t5XS5sZW5ndGg7IHgrKykge1xuICAgICAgaWYgKCEgUmV2ZXJzaUV2YWxNYWNoaW5lLmNhblB1dEludG8oY2VsbHMsIHgsIHksIHRva2VuKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbmV4dENlbGxzID0gUmV2ZXJzaUV2YWxNYWNoaW5lLmdldE5leHRDZWxsc0FmdGVyUHV0dGluZ0ludG8oY2VsbHMsIHgsIHksIHRva2VuKTtcbiAgICAgIGNvbnN0IHNjb3JlID0gLShtaW5NYXgobmV4dENlbGxzLCByZXZlcnNlZCwgZGVwdGggLSAxKSkuc2NvcmU7XG4gICAgICBpZiAoc2NvcmUgPiBiZXN0QWN0aW9uLnNjb3JlKSB7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IHsgeCwgeSB9O1xuICAgICAgICBiZXN0QWN0aW9uID0geyBhY3Rpb24sIHNjb3JlIH07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8g44OR44K544Gu5aC05ZCI44Gv6KmV5L6h5YCk44Go44GX44Gm54++5Zyo44Gu55uk6Z2i44Gu44K544Kz44Ki44KS6L+U44GZXG4gIGlmIChiZXN0QWN0aW9uLmFjdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGlvbjogdW5kZWZpbmVkLFxuICAgICAgc2NvcmU6IGV2YWxTY29yZShjZWxscywgdG9rZW4pLFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gYmVzdEFjdGlvbjtcbn1cbiJdfQ==
