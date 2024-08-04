(function (root) {

  /*
  * ブラウザ起動時に初回起動する関数
  */
  var initialize = function () {
    fetch('const/charactor.json')
      .then(response => response.json())
      .then(data => {
        var monsters = data;
        // そのうちコマンド部分のDOMはjs内で生成
        $('#monster1').on('change', function () {
          selectMonster(monsters, 1);
        });
        $('#monster2').on('change', function () {
          selectMonster(monsters, 2);
        });
        populateSelects(monsters);
        $('#startSimulation').on('click', function () {
          startSimulation(monsters);
        });
        $('#startSingleSimulation').on('click', function () {
          startSingleSimulation(monsters);
        });
        $('#closeModal').on('click', function () {
          $('#modal').css('display', 'none');
        });
      })
      .catch(error => console.error('Error loading the character data:', error));
  }

  /*
   * 各プレイヤーのドロップダウンリストにキャラクターを追加する
   * @param {Object} monsters 読み込んだキャラクターのjsonデータ
   */
  var populateSelects = function (monsters) {
    const monsterSelect1 = $('#monster1');
    const monsterSelect2 = $('#monster2');
    Object.keys(monsters).forEach(monster => {
      const option1 = $('<option>')
        .attr('value', monster)
        .text(monster);
      monsterSelect1.append(option1);
      const option2 = $('<option>')
        .attr('value', monster)
        .text(monster);
      monsterSelect2.append(option2);
    });
  };

  /*
   * プルダウンリストでモンスターを選択したときの処理
   * @param {Object} monsters 読み込んだキャラクターのjsonデータ
   * @param {Number} num 通し番号
   */
  var selectMonster = function (monsters, num) {
    const monsterSelect = $(`#monster${num}`);
    const markSpan = $(`#mark${num}`);
    const commandsTable = $(`#commands${num}`);
    const selectedMonster = monsterSelect.val();
    if (selectedMonster) {
      const monster = monsters[selectedMonster];
      markSpan.text(monster.mark);
      const rows = commandsTable.find('tr');
      monster.command.forEach((command, index) => {
        rows.eq(index).find('td').text(command.text);
      });
    } else {
      markSpan.text('');
      commandsTable.find('td').text('');
    }
  }

  var startSimulation = function (monsters) {
    const player1Monster = $('#monster1').val();
    const player2Monster = $('#monster2').val();
    if (!player1Monster || !player2Monster) {
      alert('両方のプレイヤーのモンスターを選択してください。');
      return;
    }
    const player1Wins = $('#player1Wins');
    const player2Wins = $('#player2Wins');
    const result = simulateBattles(monsters[player1Monster], monsters[player2Monster]);
    player1Wins.text(`${result.player1Wins} (分：${result.player1Draw})`);
    player2Wins.text(`${result.player2Wins} (分：${result.player2Draw})`);
  }

  var simulateBattles = function (player1Monster, player2Monster) {
    let player1Wins = 0;
    let player2Wins = 0;
    let player1Draw = 0;
    let player2Draw = 0;
    for (let i = 0; i < 100; i++) {
      let turn = i < 50 ? 'player1' : 'player2';
      player1Monster.hp = 100;
      player2Monster.hp = 100;
      while (player1Monster.hp > 0 && player2Monster.hp > 0) {
        if (turn === 'player1') {
          turnCalc(player1Monster, player2Monster);
          turn = 'player2';
        } else {
          turnCalc(player2Monster, player1Monster);
          turn = 'player1';
        }
      }
      if (player1Monster.hp > 0) {
        player1Wins++;
      } else if (player2Monster.hp > 0) {
        player2Wins++;
      } else if (player1Monster.hp <= 0 && player2Monster.hp <= 0) {
        player1Draw++;
        player2Draw++;
      }
    }
    return { player1Wins, player2Wins, player1Draw, player2Draw };
  }

  var turnCalc = function (attacker, defender) {
    executeCommand(attacker, defender);
  }

  var turnCalcLog = function (attacker, defender, player, attackerName, log) {
    const command = executeCommand(attacker, defender);
    if (player === 'プレイヤー1') {
      log.append(`<p>${player} ${attackerName} ${command.text} ${attacker.hp} ${defender.hp}</p>`);
    } else {
      log.append(`<p>${player} ${attackerName} ${command.text} ${defender.hp} ${attacker.hp}</p>`);
    }
  };

  var executeCommand = function (attacker, defender) {
    const diceRoll = Math.floor(Math.random() * 6);
    const command = attacker.command[diceRoll];
    if (command.kind === 'atk') {
      if (command.target === 'all' || command.target === defender.mark) {
        defender.hp -= command.operand;
      }
    } else if (command.kind === 'heal') {
      attacker.hp += command.operand;
      if (attacker.hp > 100) attacker.hp = 100;
    } else if (command.kind === 'megante') {
      defender.hp -= command.operand;
      attacker.hp = 0;
    } else if (command.kind === 'escape') {
      attacker.hp = 0;
    }
    return command;
  }

  var startSingleSimulation = function (monsters) {
    const player1Monster = $('#monster1').val();
    const player2Monster = $('#monster2').val();
    if (!player1Monster || !player2Monster) {
      alert('両方のプレイヤーのモンスターを選択してください。');
      return;
    }
    const player1 = monsters[player1Monster];
    const player2 = monsters[player2Monster];
    player1.hp = 100;
    player2.hp = 100;
    const modalTitle = $('#modalTitle');
    const battleLog = $('#battleLog');
    modalTitle.text(`${player1Monster} VS ${player2Monster}`);
    battleLog.html('');
    let turn = 'player1';
    while (player1.hp > 0 && player2.hp > 0) {
      if (turn === 'player1') {
        turnCalcLog(player1, player2, 'プレイヤー1', player1Monster, battleLog);
        turn = 'player2';
      } else {
        turnCalcLog(player2, player1, 'プレイヤー2', player2Monster, battleLog);
        turn = 'player1';
      }
    }
    if (player1.hp > 0) {
      battleLog.append('<p>プレイヤー1の勝ち</p>');
    } else if (player2.hp > 0) {
      battleLog.append('<p>プレイヤー2の勝ち</p>');
    } else {
      battleLog.append('<p>引き分け</p>');
    }
    $('#modal').css('display', 'block');
  }

  root.Batoen = root.Batoen || {};
  root.Batoen.Main = {
    initialize: initialize
  }

}(typeof window === 'object' ? window : typeof global === 'object' ? global : this));