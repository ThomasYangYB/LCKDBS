document.addEventListener('DOMContentLoaded', () => {
    // --- 샘플 데이터 ---
    // 실제 환경에서는 서버로부터 이 데이터를 받아와야 합니다.
    const playerData = [
        { id: 1, name: 'Faker', club: 'T1', position: 'MID', image: 'https://placehold.co/100x100/E94560/FFFFFF?text=Faker', games: 18, wins: 15, losses: 3, kda: 5.8, kills: 80, deaths: 25, assists: 65, firstKill: 5, firstTower: 7, dpm: 650, dtpm: 320, gpm: 450, cspm: 9.5, dpgr: 1.4, wards: 30 },
        { id: 2, name: 'Chovy', club: 'GEN', position: 'MID', image: 'https://placehold.co/100x100/16213E/FFFFFF?text=Chovy', games: 18, wins: 16, losses: 2, kda: 6.2, kills: 95, deaths: 22, assists: 70, firstKill: 6, firstTower: 8, dpm: 720, dtpm: 290, gpm: 480, cspm: 10.1, dpgr: 1.6, wards: 25 },
        { id: 3, name: 'ShowMaker', club: 'DK', position: 'MID', image: 'https://placehold.co/100x100/0F3460/FFFFFF?text=ShowMaker', games: 18, wins: 12, losses: 6, kda: 4.9, kills: 75, deaths: 30, assists: 72, firstKill: 4, firstTower: 6, dpm: 610, dtpm: 350, gpm: 430, cspm: 9.2, dpgr: 1.3, wards: 28 },
        { id: 4, name: 'Keria', club: 'T1', position: 'SUP', image: 'https://placehold.co/100x100/E94560/FFFFFF?text=Keria', games: 18, wins: 15, losses: 3, kda: 7.1, kills: 20, deaths: 18, assists: 190, firstKill: 2, firstTower: 3, dpm: 250, dtpm: 250, gpm: 310, cspm: 1.5, dpgr: 0.9, wards: 85 },
        { id: 5, name: 'Viper', club: 'HLE', position: 'ADC', image: 'https://placehold.co/100x100/5E72E4/FFFFFF?text=Viper', games: 18, wins: 11, losses: 7, kda: 5.1, kills: 110, deaths: 35, assists: 68, firstKill: 8, firstTower: 10, dpm: 680, dtpm: 380, gpm: 490, cspm: 9.8, dpgr: 1.5, wards: 40 }
    ];

    const player1Select = document.getElementById('player1-select');
    const player2Select = document.getElementById('player2-select');
    const player1Card = document.getElementById('player1-card');
    const player2Card = document.getElementById('player2-card');
    const statsContainer = document.getElementById('stats-container');

    function populateSelectors() {
        playerData.forEach(player => {
            player1Select.add(new Option(`${player.name} (${player.club})`, player.id));
            player2Select.add(new Option(`${player.name} (${player.club})`, player.id));
        });
    }
    
    function renderPlayerCards(player1, player2) {
        player1Card.innerHTML = player1 ? `
            <div class="player-card-content">
                <img src="${player1.image}" alt="${player1.name}" class="player-image">
                <div class="player-info"><h3>${player1.name}</h3><p>${player1.club} / ${player1.position}</p></div>
            </div>` : `<div class="player-card-placeholder">선수를 선택하세요</div>`;
        player2Card.innerHTML = player2 ? `
            <div class="player-card-content">
                <img src="${player2.image}" alt="${player2.name}" class="player-image">
                <div class="player-info"><h3>${player2.name}</h3><p>${player2.club} / ${player2.position}</p></div>
            </div>` : `<div class="player-card-placeholder">선수를 선택하세요</div>`;
    }
    
    function updateStats() {
        const player1 = playerData.find(p => p.id == player1Select.value);
        const player2 = playerData.find(p => p.id == player2Select.value);
        
        renderPlayerCards(player1, player2);
        statsContainer.innerHTML = '';

        if (!player1 && !player2) {
            statsContainer.innerHTML = `<div class="stat-row" style="justify-content:center; padding: 50px 0;">비교할 선수를 선택해주세요.</div>`;
            return;
        }
        
        const statCategories = [
            { key: 'games', label: '게임수' }, { key: 'wins', label: '승리' }, { key: 'losses', label: '패배' },
            { key: 'winrate', label: '승률' }, { key: 'kda', label: 'KDA' }, { key: 'kills', label: '킬' }, 
            { key: 'deaths', label: '데스' }, { key: 'assists', label: '어시스트' }, { key: 'firstKill', label: '첫킬' }, 
            { key: 'firstTower', label: '첫포탑' }, { key: 'dpm', label: 'DPM' }, { key: 'dtpm', label: 'DTPM' }, 
            { key: 'gpm', label: 'GPM' }, { key: 'cspm', label: 'CSPM' }, { key: 'dpgr', label: 'DPGR' }, { key: 'wards', label: '와드' }
        ];

        statCategories.forEach(stat => {
            const row = document.createElement('div');
            row.className = 'stat-row';
            
            let p1_val = player1 ? (stat.key === 'winrate' ? parseFloat(((player1.wins / player1.games) * 100).toFixed(1)) : player1[stat.key]) : 0;
            let p2_val = player2 ? (stat.key === 'winrate' ? parseFloat(((player2.wins / player2.games) * 100).toFixed(1)) : player2[stat.key]) : 0;

            let p1_display = player1 ? (stat.key === 'winrate' ? p1_val + '%' : p1_val) : '-';
            let p2_display = player2 ? (stat.key === 'winrate' ? p2_val + '%' : p2_val) : '-';

            let p1_bar_width = 50, p2_bar_width = 50;
            let p1_highlight = '', p2_highlight = '';
            
            let diffIndicatorP1 = `<div class="stat-diff-indicator player1"></div>`;
            let diffIndicatorP2 = `<div class="stat-diff-indicator player2"></div>`;

            if (player1 && player2) {
                const isLowerBetter = ['deaths', 'dtpm', 'losses'].includes(stat.key);

                if (typeof p1_val === 'number' && typeof p2_val === 'number') {
                    const diff = p1_val - p2_val;
                    if (diff !== 0) {
                        const absDiff = Math.abs(diff);
                        const roundedDiff = Math.round(absDiff * 10) / 10;
                        const diffText = `▲${roundedDiff}`;

                        if ((!isLowerBetter && diff > 0) || (isLowerBetter && diff < 0)) {
                            p1_highlight = 'highlight';
                            diffIndicatorP1 = `<div class="stat-diff-indicator player1">${diffText}</div>`;
                        } else {
                            p2_highlight = 'highlight';
                            diffIndicatorP2 = `<div class="stat-diff-indicator player2">${diffText}</div>`;
                        }
                    }
                }
                
                const total = p1_val + p2_val;
                if (total > 0) {
                    if (isLowerBetter) {
                        p1_bar_width = (p2_val / total) * 100;
                        p2_bar_width = (p1_val / total) * 100;
                    } else {
                        p1_bar_width = (p1_val / total) * 100;
                        p2_bar_width = (p2_val / total) * 100;
                    }
                }
            } else if (player1) {
                p1_bar_width = 100; p2_bar_width = 0;
            } else if (player2) {
                p1_bar_width = 0; p2_bar_width = 100;
            }

            row.innerHTML = `
                <span class="stat-value player1-stat ${p1_highlight}">${p1_display}</span>
                ${diffIndicatorP1}
                <div class="stat-center">
                    <span class="stat-label">${stat.label}</span>
                    <div class="stat-bar-container">
                        <div class="stat-bar player1-bar" style="width: ${p1_bar_width}%;"></div>
                        <div class="stat-bar player2-bar" style="width: ${p2_bar_width}%;"></div>
                    </div>
                </div>
                ${diffIndicatorP2}
                <span class="stat-value player2-stat ${p2_highlight}">${p2_display}</span>
            `;
            statsContainer.appendChild(row);
        });
    }

    player1Select.addEventListener('change', updateStats);
    player2Select.addEventListener('change', updateStats);

    populateSelectors();
    updateStats();
});

