document.addEventListener('DOMContentLoaded', () => {
    // --- 샘플 데이터 ---
    // 실제 환경에서는 서버로부터 이 데이터를 받아와야 합니다.
    const playerData = [
        { id: 1, club: 'T1', name: 'Faker', position: 'MID', games: 18, wins: 15, losses: 3, kda: 5.8, kills: 80, deaths: 25, assists: 65, firstKill: 5, firstTower: 7, dpm: 650, dtpm: 320, gpm: 450, cspm: 9.5, dpgr: 1.4, wards: 30 },
        { id: 2, club: 'GEN', name: 'Chovy', position: 'MID', games: 18, wins: 16, losses: 2, kda: 6.2, kills: 95, deaths: 22, assists: 70, firstKill: 6, firstTower: 8, dpm: 720, dtpm: 290, gpm: 480, cspm: 10.1, dpgr: 1.6, wards: 25 },
        { id: 3, club: 'DK', name: 'ShowMaker', position: 'MID', games: 18, wins: 12, losses: 6, kda: 4.9, kills: 75, deaths: 30, assists: 72, firstKill: 4, firstTower: 6, dpm: 610, dtpm: 350, gpm: 430, cspm: 9.2, dpgr: 1.3, wards: 28 },
        { id: 4, club: 'T1', name: 'Keria', position: 'SUP', games: 18, wins: 15, losses: 3, kda: 7.1, kills: 20, deaths: 18, assists: 190, firstKill: 2, firstTower: 3, dpm: 250, dtpm: 250, gpm: 310, cspm: 1.5, dpgr: 0.9, wards: 85 },
        { id: 5, club: 'HLE', name: 'Viper', position: 'ADC', games: 18, wins: 11, losses: 7, kda: 5.1, kills: 110, deaths: 35, assists: 68, firstKill: 8, firstTower: 10, dpm: 680, dtpm: 380, gpm: 490, cspm: 9.8, dpgr: 1.5, wards: 40 }
    ];

    const player1Select = document.getElementById('player1-select');
    const player2Select = document.getElementById('player2-select');
    const statsBody = document.getElementById('stats-body');

    // 선수 선택 드롭다운 채우기
    function populateSelectors() {
        playerData.forEach(player => {
            const option1 = new Option(`${player.name} (${player.club})`, player.id);
            const option2 = new Option(`${player.name} (${player.club})`, player.id);
            player1Select.add(option1);
            player2Select.add(option2);
        });
    }
    
    // 선택된 선수에 따라 스탯 테이블 업데이트
    function updateStats() {
        const player1Id = player1Select.value;
        const player2Id = player2Select.value;

        const player1 = playerData.find(p => p.id == player1Id);
        const player2 = playerData.find(p => p.id == player2Id);
        
        statsBody.innerHTML = ''; // 테이블 비우기

        if (!player1 && !player2) {
            statsBody.innerHTML = `<tr class="placeholder-row"><td colspan="20">선택된 항목에 대한 데이터가 없습니다.</td></tr>`;
            return;
        }

        const playersToDisplay = [player1, player2].filter(p => p); // 선택된 선수만 필터링
        
        const statsToCompare = ['kda', 'dpm', 'dtpm', 'gpm', 'cspm', 'dpgr'];
        const maxValues = {};

        if (player1 && player2) {
            statsToCompare.forEach(stat => {
                maxValues[stat] = Math.max(player1[stat], player2[stat]);
            });
        }
        
        playersToDisplay.forEach((player, index) => {
            const row = document.createElement('tr');
            
            // 승률 계산
            const winrate = player.games > 0 ? ((player.wins / player.games) * 100).toFixed(1) + '%' : '0%';

            // 시각적 비교를 위한 바 생성 함수
            const createStatBar = (stat) => {
                if (player1 && player2 && statsToCompare.includes(stat)) {
                    const value = player[stat];
                    const maxValue = maxValues[stat];
                    const width = (value / maxValue) * 100;
                    
                    const opponent = index === 0 ? player2 : player1;
                    const opponentValue = opponent[stat];
                    
                    let barColorClass = index === 0 ? 'player1' : 'player2';
                    if( (index === 0 && value < opponentValue) || (index === 1 && value > opponentValue) ){
                       barColorClass = index === 0 ? 'player2' : 'player1';
                    }
                    if (value === opponentValue) barColorClass = 'player1';

                    return `
                        <div class="stat-bar-container">
                            <div class="stat-bar ${barColorClass}" style="width: ${width}%;"></div>
                             <span class="stat-value">${value}</span>
                        </div>
                    `;
                }
                return player[stat];
            };

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.club}</td>
                <td>${player.name}</td>
                <td>${player.position}</td>
                <td>${player.games}</td>
                <td>${player.wins}</td>
                <td>${player.losses}</td>
                <td>${winrate}</td>
                <td>${createStatBar('kda')}</td>
                <td>${player.kills}</td>
                <td>${player.deaths}</td>
                <td>${player.assists}</td>
                <td>${player.firstKill}</td>
                <td>${player.firstTower}</td>
                <td>${createStatBar('dpm')}</td>
                <td>${createStatBar('dtpm')}</td>
                <td>${createStatBar('gpm')}</td>
                <td>${createStatBar('cspm')}</td>
                <td>${createStatBar('dpgr')}</td>
                <td>${player.wards}</td>
            `;
            statsBody.appendChild(row);
        });
    }

    // 이벤트 리스너 등록
    player1Select.addEventListener('change', updateStats);
    player2Select.addEventListener('change', updateStats);

    // 초기화
    populateSelectors();
});
