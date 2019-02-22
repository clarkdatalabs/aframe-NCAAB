//get the whole a-scene
    const aScene = d3.select('a-scene');

    const aEntity = aScene.append('a-entity')
                            .attr('id', 'whole')
                            .attr('position', '0 0 -15');



// parameters that have nothing to do with csv
    const yInterval_initial = -10,
          yInterval = 5,
          numbersOfTemas = [64, 32, 16, 8, 4, 2, 1],
          angleInterval = 2* Math.PI / 64,
          maxR = 10;



    const y_scale = d3.scaleOrdinal()
                            // .domain([64, 32, 16, 8, 4, 2, 1])
                            .domain(['First 4', 'First Round', 'Second Round', 'Sweet 16', 'Elite Eight', 'Semifinals', 'Final 2'])
                            .range([-15, -10, -5, 0, 5, 10, 15]);


// function to get the uniquename of a team
    const getName = (data) => data.market + ' ' + data.name;


    d3.csv('2017_season_detailed_cleaned.csv').then(function(data){
        var points = [],
            teams = {},
            teamId = 0;

        data.forEach((d)=>{
            points.push(+d.points_game);

            let teamName = getName(d);
            if(! teams.hasOwnProperty(teamName)) teams[teamName] = teamId++;
        })

        //parameters that need csv
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
                        .attr('color', (d)=> d.market == 'Michigan' ? 'blue' : 'orange') // here the color can be changed based on leage or something (maybe another scale is needed)
                        .attr('scale', '0.1 0.1 0.1') // the scale can be changed based on Seed like `${0.1 * d.Seed} ${0.1 * d.Seed} ${0.1 * d.Seed}`
                        .attr('position', (d) => {
                            return teamPlace(teams[getName(d)], d.points_game, d.tournament_round)
                        })
                        .attr('event-set__mouseenter', function(d){
                            return 'material.opacity: 0.5';
                        })
                        .attr('event-set__mouseleave', function(){
                            return 'material.opacity: 1';
                        })
                        .on('mouseenter', function(d){
                            console.log(d.points_game, " & ", getName(d), " & ", teams[getName(d)], " & ", d.tournament_round)
                        })



        // create the circles as round scales
            aEntity.selectAll('.circleRuller')
                    .data(data)
                    .enter()
                    .append('a-circle')
                    .classed('circleRuller', true)
                    .attr('wireframe', true)
                    .attr('color', 'yellow')
                    .attr('opacity', 0.1)
                    .attr('rotation', '90 0 0')
                    .attr('radius', (d) => r_scale(d.points_game))
                    .attr('position', (d) => `0 ${y_scale(d.tournament_round)} 0`)
    })


    // //create each round layer
    //     for(let i = 0; i < 7; i ++){
    //         // let numberOfTeams = numbersOfTemas[i],
    //         //     thisRound = document.createElement('a-entity');
    //         // thisRound.setAttribute('id', `round_${numberOfTeams}`);
    //         // thisRound.setAttribute('position', `0 ${yInterval_initial + i * yInterval} -15`);
    //         // aScene.appendChild(thisRound);
    //
    //         // create the detail in each round
    //             for(let j = 0; j < numberOfTeams; j ++){
    //                 // //create the sphere
    //                 //     // create a sphere representing one team
    //                 //         let aSphere = document.createElement('a-sphere');
    //                 //         aSphere.setAttribute('color','blue');
    //                 //         aSphere.setAttribute('scale','0.1 0.1 0.1');
    //                 //     // generate the parameters for the entity
    //                 //         let thisR = Math.random() * maxR;     // returns a random number from 0 to maxR
    //                 //         let xPosition = Math.cos(angleInterval * j) * thisR;
    //                 //         let zPosition = Math.sin(angleInterval * j) * thisR;
    //                 //     // set the parameter to the entity to adjust its position
    //                 //         aSphere.setAttribute('position', `${xPosition} 0 ${zPosition}`);
    //
    //                 // //create the circle
    //                 //     // create a circle to identify its R
    //                 //         let aCircle = document.createElement('a-circle');
    //                 //     // set basic parameters
    //                 //         aCircle.setAttribute('wireframe', 'true');
    //                 //         aCircle.setAttribute('color', 'yellow');
    //                 //         aCircle.setAttribute('opacity', 0.1);
    //                 //         aCircle.setAttribute('rotation', '90 0 0');
    //                 //
    //                 //     // set customized parameters
    //                 //         aCircle.setAttribute('radius', thisR);
    //
    //                 // // add the rGuideCircle and the entity into the layer it belongs to
    //                 //     thisRound.appendChild(aCircle)
    //                 //     thisRound.appendChild(aSphere);
    //             }
    //         }



// // interaction
//     const spheres = document.querySelectorAll('a-sphere');
//     spheres.forEach((s) => {
//         s.addEventListener('mouseenter', function(){
//             this.setAttribute('opacity', 0.5);
//         })
//         s.addEventListener('mouseleave', function(){
//             this.setAttribute('opacity', 1);
//         })
//     })
