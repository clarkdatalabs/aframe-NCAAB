// get the whole a-scene
    const aScene = d3.select('a-scene');

    const aEntity = aScene.append('a-entity')
                            .attr('id', 'whole')
                            .attr('position', '0 0 -15');



// independent parameters
    const yInterval_initial = -10,
          yInterval = 5,
          numbersOfTemas = [64, 32, 16, 8, 4, 2, 1],
          angleInterval = 2* Math.PI / 64,
          maxR = 10;

    //colors assignment
        const color_normalTeam = 'orange',
              color_theTeam = 'blue',
              color_circleScale = 'white',
              color_oppositeLine = 'red',
              color_selfCurve = 'green';

    const y_scale = d3.scaleOrdinal()
                      .domain(['First 4', 'First Round', 'Second Round', 'Sweet 16', 'Elite Eight', 'Semifinals', 'Final 2'])
                      .range([-15, -10, -5, 0, 5, 10, 15]);


// function to get the uniquename of a team
    const getName = (data) => data.market + ' ' + data.name;


    d3.csv('2017_season_detailed_cleaned.csv').then(function(data){
        var points = [], // to collect all points
            teams = {}, // to have each unique team collected and assigne teamIndex
            teamId = 0,
            gameTeamIdPositions = {}; // get the pairs of id (in csv) & point position

        data.forEach((d)=>{
            points.push(+d.points_game);

            let teamName = getName(d);
            if(! teams.hasOwnProperty(teamName)) teams[teamName] = teamId++;
        })

        // parameters that need csv
        const maxPoint = Math.max(...points),
              minPoint = Math.min(...points);

        const r_scale = d3.scaleLinear()
                              .domain([minPoint, maxPoint])
                              .range([maxR, 0]);

        // function to position a team at a round
        const teamPlace = (teamIndex, score, round) => {
            let this_r = r_scale(score);
            let x_position = Math.cos(angleInterval * teamIndex) * this_r,
                y_position = y_scale(round),
                z_position = Math.sin(angleInterval * teamIndex) * this_r;
            return(`${x_position} ${y_position} ${z_position}`);
        };


        // create the spheres as teams
            aEntity.selectAll('.team')
                    .data(data)
                    .enter()
                    .append('a-sphere')
                        .classed('team', true)
                        .attr('color', (d)=> d.market == 'Michigan' ? color_theTeam : color_normalTeam) // here the color can be changed based on leage or something (maybe another scale is needed)
                        .attr('scale', '0.1 0.1 0.1') // the scale can be changed based on Seed like `${0.1 * d.Seed} ${0.1 * d.Seed} ${0.1 * d.Seed}`
                        .attr('position', (d) => {
                            let thisPosition = teamPlace(teams[getName(d)], d.points_game, d.tournament_round);
                            gameTeamIdPositions[d.id] = thisPosition;
                            return thisPosition;
                        })
                        .attr('event-set__mouseenter', function(d){ // a-frame way of on "mouseenter"
                            return 'material.opacity: 0.5';
                        })
                        .attr('event-set__mouseleave', function(){ // a-frame way of on "mouseleave"
                            return 'material.opacity: 1';
                        })
                        .on('mouseenter', function(d){ // debugging
                            console.log(d.points_game, " & ", getName(d), " & ", teams[getName(d)], " & ", d.tournament_round)
                        })



        // create the circles as round scales (the lower the score, the outer)
            // set the lineweight
                var ringLineWeight = 0.005;
            // draw it
                aEntity.selectAll('.circleRuller')
                        .data(data)
                        .enter()
                        .append('a-torus')
                        .classed('circleRuller', true)
                        .attr('side', 'double')
                        .attr('color', color_circleScale)
                        .attr('opacity', 0.1)
                        .attr('rotation', '90 0 0')
                        .attr('radius', (d) => r_scale(d.points_game) + ringLineWeight/2)
                        .attr('radius-tubular', ringLineWeight)
                        .attr('segments-tubular', 150)
                        .attr('position', (d) => `0 ${y_scale(d.tournament_round)} 0`)


        // // create the lines between the opposite teams
        //     const data_firstHalf = data.slice(0, 67);
        //     aEntity.selectAll('.rivalLine')
        //             .data(data_firstHalf)
        //             .enter()
        //             .append('a-entity')
        //             .classed('rivalLine', true)
        //             .attr('line', (d)=>{
        //                 //format: <a-entity line="start: 0, 1, 0; end: 2 0 -5; color: red"></a-entity>
        //                 let thisTeamPosition = gameTeamIdPositions[d.id],
        //                     thatTeamPosition = gameTeamIdPositions[d.id + 67];
        //                 return `start: ${thisTeamPosition}; end: ${thatTeamPosition}; color: ${color_oppositeLine}`;
        //             })
    })
