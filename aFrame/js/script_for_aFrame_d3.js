// get the whole a-scene
    const aScene = d3.select('a-scene');

    const aEntity = aScene.append('a-entity')
                            .attr('id', 'whole')
                            .attr('position', '0 0 -15');
    
    //Create HUD
    const aHead = d3.select('#head');
    const hud = aHead.append('a-entity')
                        //.attr('id','hud')
                        .attr('geometry','primitive: plane; height: 0.2; width: 0.2')
                        .attr('position','-2 1 -1.5') //X,Y,Z
                        .attr('material',"color: gray; opacity: 1")
                        .attr('text','value: noooooo');


// independent parameters
    const yInterval_initial = -10,
          yInterval = 5,
          numbersOfTemas = [64, 32, 16, 8, 4, 2, 1],
          angleInterval = 2* Math.PI / 64,
          maxR = 10,
          heights = [-15, -10, -5, 0, 5, 10, 15]; // the actual heights of each round in the VR

    //colors assignment
        const color_normalTeam = 'orange',
              color_theTeam = 'blue',
              color_circleScale = 'white',
              color_oppositeLine = 'red',
              color_selfCurve = 'green';

    const y_scale = d3.scaleOrdinal()
                      .domain(['First 4', 'First Round', 'Second Round', 'Sweet 16', 'Elite Eight', 'Semifinals', 'Final 2'])
                      .range(heights);


// FUNCTION to get the uniquename of a team
    const getName = (data) => {
        let usableMarketName = data.market.replace(' ', '_'),
            usableTeamName =  data.name.replace(' ', '_')
        return usableMarketName + '_' + usableTeamName;
    }

    


d3.csv('2017_season_detailed_cleaned.csv').then(function(data){
    var points = [], // 1.0 to collect points get by all games, for min/max ponits
        teams = {}, // 2.0 {teamUniqueName: teamIndex} to have each unique team collected and assigned teamIndex
        teamIndex = 0, // 2.1 teamIndex, this is to assign each team on specific angels
        gameTeamIdPositions = {}, // 3.0 {id: point, id: point, ...} get the pairs of id (in csv) & point position, This is for lines between opposite teams
        teamsSelfPositions = {}; // 2.2 {teamName:[points], ...} This is for curves among themselves through rounds

    // assigne teamIndex to each team named teamUniqueName
        data.forEach((d)=>{
            points.push(+d.points_game);

            let teamName = getName(d);
            if(! teams.hasOwnProperty(teamName)) teams[teamName] = teamIndex++;
        })

    // parameters that need csv
    const maxPoint = Math.max(...points),
          minPoint = Math.min(...points);

    const r_scale = d3.scaleLinear()
                          .domain([minPoint, maxPoint])
                          .range([maxR, 0]);

    // FUNCTION to position a team at a round
    const teamPlace = (teamIndex, score, round) => {
        let this_r = r_scale(score);
        let x_position = Math.cos(angleInterval * teamIndex) * this_r,
            y_position = y_scale(round),
            z_position = Math.sin(angleInterval * teamIndex) * this_r;
        return(`${x_position} ${y_position} ${z_position}`);
    };


    // create curves among the team itself of different rounds
        // collection for all the a-curves
            var curves = {}; // {teamUniqueNames: 0, teamUniqueNames: 1, ...} teamUniqueNames for teams that already been detected, 0 means it has only one point so no curve, 1 means it has a curve
            var thisCurve;
        // FUNCTION create the curves among the team itself at different rounds
            const drawTeamCurve = (teamUniqueName) => {
                // console.log('draw a selfCurve for ', teamUniqueName);

                let curveId = `#${teamUniqueName}`;
                // // delete existing draw_curve
                //     d3.select('a-draw-curve').remove();
                // if the team has been detected
                    if (curves.hasOwnProperty(teamUniqueName)){
                        // if the team has a curve, then draw it
                            if (curves[teamUniqueName] == 1){  // curve is {teamUniqueNames: 0, teamUniqueNames: 1, ...}. teamUniqueNames for teams that already been detected, 0 means it has only one point so no curve, 1 means it has a curve
                                aEntity.append('a-draw-curve')
                                        .attr('material', `shader: line; color: ${color_selfCurve};`)
                                        .attr('curveref', curveId);

                                // console.log("This team is in record, draw again!");
                            } else{
                                // console.log("This team is in record, but it does not make any progress in the tournament...");
                            }
                    }
                // if the team has not been detected, then let's detect
                    else {
                        let positions = teamsSelfPositions[teamUniqueName];  // {teamName:[points], ...}, this is generated when the node was generated
                        // console.log("positions this time: ",positions)
                        // if the team has only one point, it will have no curve, so just record it
                            if (positions.length == 1) {
                                // record
                                    curves[teamUniqueName] = 0;

                                // console.log("Have put this team in record, but it does not make any progress in the tournament...");
                            }
                        // else, record it, construct the curve, and then draw it
                            else {
                                // record
                                    curves[teamUniqueName] = 1;
                                // sort the positions array
                                    positions.sort((a,b)=>{
                                        var y_a = a.split(" ")[1],
                                            y_b = b.split(" ")[1];
                                        return y_a - y_b;
                                    });
                                // construct the curve from the array
                                    thisCurve = aEntity.append('a-curve')
                                                        .classed('selfCurve', true)
                                                        .attr('id', teamUniqueName)
                                // put each point as an a-curve-point into the a-curve
                                // console.log(positions);
                                    positions.forEach((p) => {
                                        thisCurve.append('a-curve-point')
                                                    .attr('position', p)

                                    })

                                // draw the curve
                                    aEntity.append('a-draw-curve')
                                            .attr('id', `${teamUniqueName}Curve`)
                                            .attr('curveref', () => curveId)
                                            .attr('material', `color: ${color_selfCurve}; opacity: 0.3`)


                                // console.log("Have put this team in record, draw!");
                            }
                    }
            }


    // create the spheres as teams
        aEntity.selectAll('.team')
                .data(data)
                .enter()
                .append('a-sphere')
                    .classed('team', true)
                    .attr('color', (d)=> d.market == 'Michigan' ? color_theTeam : color_normalTeam) // here the color can be changed based on leage or something (maybe another scale is needed)
                    .attr('scale', '0.1 0.1 0.1') // the scale can be changed based on Seed like `${0.1 * d.Seed} ${0.1 * d.Seed} ${0.1 * d.Seed}`
                    .attr('position', (d) => {
                        let teamUniqueName = getName(d),
                            thisPosition = teamPlace(teams[teamUniqueName], d.points_game, d.tournament_round);
                        // record the position for rival lines
                            gameTeamIdPositions[d.id] = thisPosition;
                        // record the position for self curves
                            if (! teamsSelfPositions.hasOwnProperty(teamUniqueName)){
                                teamsSelfPositions[teamUniqueName] = [thisPosition];
                            } else {
                                teamsSelfPositions[teamUniqueName].push(thisPosition);
                            }

                        return thisPosition;
                    })
                    // .attr('event-set__mouseenter', function(d){ // a-frame way of on "mouseenter"
                    //     return 'material.opacity: 0.5';
                    // })
                    // .attr('event-set__mouseleave', function(){ // a-frame way of on "mouseleave"
                    //     return 'material.opacity: 1';
                    // })
                    .on('mouseenter', function(d){
                        this.setAttribute('opacity', '0.5');
                        let teamUniqueName = getName(d);
                        // console.log(d.points_game, " & ", teamUniqueName, " & ", teams[teamUniqueName], " & ", d.tournament_round)
                        let selectedCurve = document.querySelector(`#${teamUniqueName}Curve`);
                        selectedCurve.setAttribute('material', `color: ${color_selfCurve}; opacity: 0.8`);
                        
                        //HUD Doesn't Work
                        let HUD = document.querySelector('#head');
                        HUD.setAttribute('text','value:' + teamUniqueName)

                        console.log(this)
                    })
                    .on('mouseleave', function(d){
                        this.setAttribute('opacity', '1');
                        let teamUniqueName = getName(d),
                            selectedCurve = document.querySelector(`#${teamUniqueName}Curve`),
                            currentCurveOpacity = selectedCurve.getAttribute('material').opacity;
                        if(currentCurveOpacity == 0.8) {
                            selectedCurve.setAttribute('material', `color: ${color_selfCurve}; opacity: 0.3`);
                        }
                    })
                    .on('click', function(d){
                        let teamUniqueName = getName(d),
                            selectedCurve = document.querySelector(`#${teamUniqueName}Curve`),
                            currentCurveOpacity = selectedCurve.getAttribute('material').opacity;
                        if(currentCurveOpacity == 0.8) {
                            selectedCurve.setAttribute('material', `color: ${color_selfCurve}; opacity: 1`);
                        } else {
                            selectedCurve.setAttribute('material', `color: ${color_selfCurve}; opacity: 0.8`);
                        }
                    })



    // create the circles as round scales (the lower the score, the outer)
        // set the lineweight
            var torusLineWeight = 0.005,
                ringLineWeight = 0.025;
        // draw it the 3D way
            aEntity.selectAll('.circleRuller')
                    .data(data)
                    .enter()
                    .append('a-torus')
                    .classed('circleRuller', true)
                    .attr('color', color_circleScale)
                    .attr('opacity', 0.1)
                    .attr('rotation', '90 0 0')
                    .attr('radius', (d) => r_scale(d.points_game))
                    .attr('radius-tubular', torusLineWeight)
                    .attr('segments-tubular', 100)
                    .attr('position', (d) => {
                        let thisHeight = y_scale(d.tournament_round);
                        return `0 ${thisHeight} 0`;
                    })

        // // or draw it the 2D way
        //     aEntity.selectAll('.circleRuller')
        //             .data(data)
        //             .enter()
        //             .append('a-ring')
        //             .classed('circleRuller', true)
        //             .attr('side', 'double')
        //             .attr('color', color_circleScale)
        //             .attr('opacity', 0.1)
        //             .attr('rotation', '90 0 0')
        //             .attr('radius-outer', (d) => r_scale(d.points_game) + ringLineWeight/2)
        //             .attr('radius-inner', (d) => r_scale(d.points_game) - ringLineWeight/2)
        //             .attr('segments-theta', 100)
        //             .attr('position', (d) => `0 ${y_scale(d.tournament_round)} 0`)

    // create the target to move to a different height
        const headRig = d3.select("#cameraRig");
        var heightAt = 0;
        aEntity.selectAll(".heightPort")
                .data(heights)
                .enter()
                .append('a-ring')
                .classed('heightPort', true)
                .attr('id',(d) => `heightPort_${d}`)
                .attr('position', (d) => `0 ${d} 0`)
                .attr('radius-outer', '15')
                .attr('radius-inner', '14.5')
                .attr('rotation', '90 0 0')
                .attr('side', 'double')
                .attr('segments-theta', 100)
                .attr('color', 'gold')
                .attr('opacity', 0.1)
                .attr('event-set__mouseenter', 'opacity: 0.8')
                .attr('event-set__mouseleave', 'opacity: 0.1')
                .on('click', (d) => {
                    // console.log(headRig.attr('position'))
                    let targetHeight = d;
                    let currentPosition = headRig.attr('position');
                    let targetPosition = currentPosition;
                    targetPosition.y = targetHeight;

                    // console.log(targetHeight)

                    headRig.attr('position', targetPosition)
                })



    // create the lines between the opposite teams
        const data_firstHalf = data.slice(0, 67);
        aEntity.selectAll('.rivalLine')
                .data(data_firstHalf)
                .enter()
                .append('a-entity')
                .classed('rivalLine', true)
                .attr('line', (d)=>{
                    //format: <a-entity line="start: 0, 1, 0; end: 2 0 -5; color: red"></a-entity>
                    let thisTeamPosition = gameTeamIdPositions[d.id],
                        thatTeamPosition = gameTeamIdPositions[+d.id + 67];
                    return `start: ${thisTeamPosition}; end: ${thatTeamPosition}; color: ${color_oppositeLine}; opacity: 0.75`;
                })


    // Draw all curves, because for some reasons, draw curves one by one does not work...
        var teamUniqueNames = Object.keys(teams);
        teamUniqueNames.forEach((uniqueName) => {
            // console.log(uniqueName);
            drawTeamCurve(uniqueName)
        })



})
