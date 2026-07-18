(() => {
  'use strict';

  const APP_VERSION = 'health-app-v1.0.0';
  const STORAGE_KEY = 'completeHealthAppStateV1';

  const DEFAULT_STATE = {
    goal: 'general',
    level: 'beginner',
    equipment: 'none',
    theme: 'system',
    sound: 'on',
    diet: 'lacto',
    currentDay: 1,
    completedDays: [],
    workouts: [],
    checkins: [],
    safetyAck: false
  };

  const GOALS = {
    general: { label: 'General fitness', note: 'Build balanced strength, stamina, mobility and consistency.' },
    fat: { label: 'Reduce body fat', note: 'Combine consistent training, daily movement, sleep and a sustainable eating pattern.' },
    stamina: { label: 'Improve stamina', note: 'Progress gradually by moving longer while maintaining controlled breathing and good form.' },
    shape: { label: 'Shape and tone body', note: 'Use controlled repetitions, full range of motion and progressive resistance.' },
    strength: { label: 'Build strength', note: 'Slow the lowering phase and add resistance only after technique is reliable.' }
  };

  const EXERCISES = {
    march: ex('March in Place', 'warmup', ['Legs', 'Heart'], 'Raises body temperature and prepares joints for exercise.', ['Stand tall with ribs stacked over hips.', 'Lift one knee while swinging the opposite arm.', 'Land softly and keep a steady breathing rhythm.'], 'Use a slower pace and hold a wall.', 'Drive the knees higher and move the arms faster.', 'Do not lean backwards or stamp the feet.', 'march'),
    armCircles: ex('Arm Circles', 'warmup', ['Shoulders', 'Upper back'], 'Warms the shoulders and improves movement awareness.', ['Stand tall with arms extended.', 'Make small controlled circles, then gradually enlarge them.', 'Reverse direction halfway through.'], 'Keep the circles small.', 'Add a light squat while circling.', 'Avoid forcing painful shoulder range.', 'shoulder'),
    stepTouch: ex('Step Touch', 'warmup', ['Hips', 'Legs'], 'Gently raises heart rate and coordinates side-to-side movement.', ['Step one foot sideways.', 'Bring the other foot in lightly.', 'Repeat side to side with relaxed arm swings.'], 'Take smaller steps.', 'Add a deeper knee bend and larger arm swing.', 'Keep knees tracking over toes.', 'jack'),
    hipCircles: ex('Hip Circles', 'warmup', ['Hips', 'Core'], 'Lubricates the hip joints and prepares the trunk.', ['Stand with feet comfortably apart.', 'Move the hips in a slow circle.', 'Keep the chest tall and reverse direction.'], 'Make a smaller circle.', 'Add a gentle knee bend.', 'Do not force the lower back.', 'mobility'),
    torsoTwist: ex('Standing Torso Twist', 'warmup', ['Spine', 'Core'], 'Warms the trunk for rotational movement.', ['Stand tall with soft knees.', 'Rotate the rib cage gently from side to side.', 'Let the arms move naturally without forcing range.'], 'Keep hands on the chest and use a small range.', 'Add a controlled knee lift toward the opposite elbow.', 'Do not twist sharply through the knees.', 'twist'),
    heelDigs: ex('Heel Digs', 'warmup', ['Hamstrings', 'Calves'], 'Warms the back of the legs and ankles.', ['Tap one heel forward with toes lifted.', 'Sit the hips back slightly.', 'Alternate sides with easy arm pulls.'], 'Keep the heel closer to the body.', 'Move faster while staying light on the feet.', 'Do not lock the supporting knee.', 'march'),
    kneeHugs: ex('Alternating Knee Hug', 'warmup', ['Hips', 'Balance'], 'Mobilises the hips and practises single-leg balance.', ['Stand tall and lift one knee.', 'Gently draw it toward the chest.', 'Release slowly and change sides.'], 'Hold a wall and lift only to a comfortable height.', 'Rise onto the toes of the standing leg.', 'Avoid rounding the back to reach the knee.', 'balance'),
    ankleRolls: ex('Ankle Rolls', 'warmup', ['Ankles', 'Calves'], 'Prepares the ankles for squats, lunges and cardio.', ['Shift weight onto one leg while holding support if needed.', 'Lift the other foot slightly.', 'Circle the ankle slowly in both directions.'], 'Keep toes on the floor and circle the heel.', 'Balance without support.', 'Move slowly and avoid pain.', 'calf'),
    squat: ex('Bodyweight Squat', 'strength', ['Thighs', 'Glutes', 'Core'], 'Builds lower-body strength for standing, lifting and climbing.', ['Set feet about shoulder-width apart.', 'Sit hips down and back while knees track over toes.', 'Press through the whole foot to stand tall.'], 'Squat to a chair or use a smaller depth.', 'Add a slow three-second lowering phase or hold dumbbells.', 'Do not let knees collapse inward or heels lift.', 'squat'),
    sumoSquat: ex('Sumo Squat', 'strength', ['Inner thighs', 'Glutes'], 'Strengthens the hips and inner thighs through a wider stance.', ['Take a wide stance with toes turned slightly out.', 'Lower the hips while keeping the chest tall.', 'Squeeze the glutes as you stand.'], 'Use a shallow range and hold support.', 'Add a pulse at the bottom or hold a dumbbell.', 'Do not force the knees wider than the toes.', 'squat'),
    squatPulse: ex('Squat Pulse', 'strength', ['Thighs', 'Glutes'], 'Increases muscular endurance in the legs.', ['Lower into a comfortable squat.', 'Move up and down only a few centimetres.', 'Keep weight through the mid-foot and heel.'], 'Pulse higher or alternate with full standing.', 'Stay lower while maintaining alignment.', 'Stop if knees or lower back become painful.', 'squat'),
    reverseLunge: ex('Reverse Lunge', 'strength', ['Thighs', 'Glutes', 'Balance'], 'Builds leg strength and balance with less forward knee stress than many forward lunges.', ['Step one foot back and land on the ball of the foot.', 'Bend both knees while keeping the front foot planted.', 'Push through the front foot to return.'], 'Hold a wall and take a shorter step.', 'Add a knee drive or hold dumbbells.', 'Keep the front knee tracking over the middle toes.', 'lunge'),
    sideLunge: ex('Side Lunge', 'strength', ['Glutes', 'Inner thighs'], 'Strengthens side-to-side movement and hip control.', ['Step wide to one side.', 'Sit the hips back over the stepping leg while the other leg stays long.', 'Push the floor away to return to centre.'], 'Use a smaller side step.', 'Hold a dumbbell at chest height.', 'Keep the working heel down and chest lifted.', 'lunge'),
    curtsyLunge: ex('Curtsy Step-Back', 'strength', ['Glutes', 'Thighs'], 'Challenges hip control and glute endurance.', ['Step one foot diagonally behind the other.', 'Bend both knees only as far as comfortable.', 'Press through the front foot to stand.'], 'Use a normal reverse lunge instead.', 'Add a controlled knee lift on return.', 'Avoid twisting the front knee inward.', 'lunge'),
    gluteBridge: ex('Glute Bridge', 'strength', ['Glutes', 'Hamstrings', 'Core'], 'Strengthens the hips and supports better lifting mechanics.', ['Lie on your back with knees bent and feet planted.', 'Brace gently and squeeze the glutes to lift the hips.', 'Pause, then lower without over-arching the back.'], 'Lift only partway.', 'Use a single-leg variation or add a dumbbell across the hips.', 'Do not push from the neck or flare the ribs.', 'bridge'),
    singleLegBridge: ex('Alternating Bridge March', 'strength', ['Glutes', 'Core'], 'Builds hip stability while resisting trunk rotation.', ['Lift into a comfortable bridge.', 'Keep the pelvis level and lift one foot a few centimetres.', 'Set it down and alternate.'], 'Hold a normal bridge.', 'Straighten the lifted leg farther from the body.', 'Do not let one hip drop.', 'bridge'),
    calfRaise: ex('Calf Raise', 'strength', ['Calves', 'Ankles'], 'Improves ankle strength and walking or running efficiency.', ['Stand tall with feet parallel.', 'Rise smoothly onto the balls of the feet.', 'Pause and lower with control.'], 'Hold a wall and use both legs.', 'Use one leg or hold dumbbells.', 'Do not roll ankles outward.', 'calf'),
    wallSit: ex('Wall Sit', 'strength', ['Thighs', 'Glutes'], 'Builds lower-body endurance without repeated impact.', ['Place your back against a wall.', 'Slide down to a comfortable knee angle.', 'Press the back gently into the wall and breathe.'], 'Stay higher and hold for less time.', 'Hold a weight or alternate heel lifts.', 'Do not force a deep position if knees hurt.', 'wall'),
    goodMorning: ex('Hip Hinge / Good Morning', 'strength', ['Hamstrings', 'Glutes', 'Back'], 'Teaches safe bending and strengthens the posterior chain.', ['Stand tall with hands on hips or chest.', 'Soften knees and push hips backward while the spine stays long.', 'Squeeze glutes to return upright.'], 'Use a smaller hip movement.', 'Hold dumbbells or slow the lowering phase.', 'Do not round the lower back.', 'hinge'),
    donkeyKick: ex('Donkey Kick', 'strength', ['Glutes', 'Core'], 'Trains hip extension while the trunk stays stable.', ['Start on hands and knees.', 'Keep one knee bent and press the foot upward.', 'Stop before the lower back arches and lower slowly.'], 'Reduce the lift height.', 'Add a pause at the top or a resistance band.', 'Do not rotate the pelvis.', 'bird'),
    fireHydrant: ex('Fire Hydrant', 'strength', ['Side glutes', 'Core'], 'Strengthens the side glutes for knee and pelvic stability.', ['Start on hands and knees.', 'Lift one bent knee out to the side.', 'Keep the trunk still and lower with control.'], 'Lift only a few centimetres.', 'Add a resistance band above the knees.', 'Do not shift all body weight to one side.', 'bird'),
    inclinePushup: ex('Incline Push-Up', 'strength', ['Chest', 'Arms', 'Core'], 'Builds upper-body pushing strength with an adjustable difficulty.', ['Place hands on a stable wall, bench or counter.', 'Keep the body in one long line.', 'Lower the chest toward the support and press away.'], 'Use a higher wall position.', 'Use a lower surface or progress to the floor.', 'Do not let hips sag or elbows flare straight sideways.', 'pushup'),
    pushup: ex('Push-Up', 'strength', ['Chest', 'Arms', 'Core'], 'Strengthens the chest, shoulders, triceps and trunk.', ['Set hands slightly wider than shoulders.', 'Keep head, ribs, hips and legs aligned.', 'Lower with control and press the floor away.'], 'Use knees down or an incline.', 'Use a slower lowering phase or a pause near the floor.', 'Do not drop the hips or crane the neck.', 'pushup'),
    pikePress: ex('Pike Shoulder Press', 'strength', ['Shoulders', 'Arms'], 'Builds shoulder pushing strength using body weight.', ['Start with hips high and hands firmly planted.', 'Bend elbows and lower the head between the hands.', 'Press back to the starting position.'], 'Use a wall press with hips slightly back.', 'Elevate the feet carefully.', 'Keep elbows angled back rather than flared wide.', 'pushup'),
    shoulderTap: ex('Plank Shoulder Tap', 'core', ['Core', 'Shoulders'], 'Improves trunk stability while transferring weight between the arms.', ['Start in a high plank or hands-and-knees position.', 'Brace and lift one hand to tap the opposite shoulder.', 'Place it down quietly and alternate.'], 'Perform from hands and knees.', 'Use a full plank with feet closer together.', 'Do not let the hips rock side to side.', 'plank'),
    tricepsDip: ex('Chair Triceps Dip', 'strength', ['Triceps', 'Shoulders'], 'Strengthens the back of the arms.', ['Use a very stable chair against a wall.', 'Keep hips close to the chair and bend elbows backward.', 'Press through the hands to return.'], 'Keep knees bent and use a shallow range.', 'Move feet farther away.', 'Avoid if the front of the shoulder feels pinched.', 'dip'),
    bentRow: ex('Bent-Over Row', 'strength', ['Upper back', 'Arms'], 'Strengthens posture muscles and balances pushing exercises.', ['Hinge at the hips with a long spine.', 'Pull elbows toward the back pockets.', 'Lower the hands slowly without shrugging.'], 'Use water bottles or no weight and squeeze the shoulder blades.', 'Use dumbbells and pause at the top.', 'Do not round the back or jerk the weight.', 'row'),
    reverseFly: ex('Bent-Over Reverse Fly', 'strength', ['Upper back', 'Rear shoulders'], 'Strengthens the muscles that support upright posture.', ['Hinge forward with soft knees.', 'Open the arms out to the sides with a slight elbow bend.', 'Squeeze shoulder blades gently and lower.'], 'Use no weight and a smaller range.', 'Use light dumbbells with slow control.', 'Do not shrug or swing.', 'row'),
    floorPress: ex('Floor Chest Press', 'strength', ['Chest', 'Arms'], 'Builds pushing strength with the floor limiting shoulder depth.', ['Lie on the back with knees bent.', 'Hold dumbbells or water bottles above the elbows.', 'Press upward and lower until upper arms gently touch the floor.'], 'Press one arm at a time with very light weight.', 'Use heavier dumbbells while keeping control.', 'Keep wrists stacked and ribs relaxed.', 'press'),
    superman: ex('Prone Back Extension', 'strength', ['Upper back', 'Glutes'], 'Builds endurance in the back and hip extensors.', ['Lie face down with the neck long.', 'Lift the chest and hands only a small amount.', 'Lower slowly while keeping the glutes gently active.'], 'Lift only the chest or alternate one arm and opposite leg.', 'Add a longer pause at the top.', 'Do not throw the head back or over-arch.', 'superman'),
    plank: ex('Forearm Plank', 'core', ['Core', 'Shoulders'], 'Builds whole-trunk endurance and body alignment.', ['Place elbows under shoulders.', 'Create a long line from head to heels or knees.', 'Brace as if preparing for a gentle punch and breathe normally.'], 'Keep knees on the floor or use an incline.', 'Use a full plank and alternate leg lifts.', 'Do not hold your breath or let the lower back sag.', 'plank'),
    sidePlank: ex('Side Plank', 'core', ['Side core', 'Shoulder'], 'Strengthens the obliques and lateral hip stabilisers.', ['Place elbow below shoulder.', 'Lift the hips and create a straight line through the body.', 'Keep the chest facing forward and breathe.'], 'Keep the lower knee on the floor.', 'Stack the feet and lift the top leg.', 'Do not collapse into the shoulder.', 'sideplank'),
    deadBug: ex('Dead Bug', 'core', ['Deep core', 'Hips'], 'Teaches trunk control while arms and legs move.', ['Lie on the back with arms up and hips and knees bent.', 'Gently brace and lower one heel and the opposite arm.', 'Return before the lower back lifts and alternate.'], 'Move only the legs or tap one heel close to the body.', 'Straighten the moving leg farther.', 'Keep the lower back comfortably supported.', 'deadbug'),
    birdDog: ex('Bird Dog', 'core', ['Core', 'Back', 'Glutes'], 'Improves spinal stability, balance and coordination.', ['Start on hands and knees.', 'Reach one arm forward and the opposite leg back.', 'Keep hips level, return slowly and change sides.'], 'Move only one limb at a time.', 'Pause longer or draw elbow and knee together.', 'Do not rotate the pelvis or overreach.', 'bird'),
    heelTap: ex('Heel Tap Crunch', 'core', ['Abdominals', 'Side core'], 'Builds abdominal endurance with a small controlled movement.', ['Lie on the back with knees bent.', 'Lift shoulder blades slightly and reach toward one heel.', 'Return through centre and alternate sides.'], 'Keep the head down and slide one hand at a time.', 'Move heels farther away.', 'Do not pull the neck forward.', 'crunch'),
    bicycle: ex('Slow Bicycle', 'core', ['Abdominals', 'Obliques'], 'Trains rotation and hip control when performed slowly.', ['Lie on the back and lift the shoulder blades gently.', 'Extend one leg while rotating the ribs toward the opposite knee.', 'Change sides slowly without pulling the neck.'], 'Keep one foot on the floor between repetitions.', 'Straighten the leg lower while maintaining back position.', 'Avoid fast, jerky twisting.', 'crunch'),
    crunch: ex('Controlled Crunch', 'core', ['Abdominals'], 'Strengthens the front of the trunk through a small range.', ['Lie on the back with feet planted.', 'Exhale and lift the shoulder blades slightly.', 'Pause and lower slowly.'], 'Keep the head down and practise abdominal bracing.', 'Hold the top briefly or extend arms overhead.', 'Do not pull the neck or sit all the way up.', 'crunch'),
    lowJack: ex('Low-Impact Jack', 'cardio', ['Heart', 'Legs', 'Shoulders'], 'Raises heart rate without jumping.', ['Step one foot out as arms travel overhead.', 'Bring the foot in as arms lower.', 'Alternate sides at a steady pace.'], 'Keep arms below shoulder height.', 'Progress to a jumping jack.', 'Land softly and keep knees aligned.', 'jack'),
    highKnees: ex('High-Knee March or Run', 'cardio', ['Heart', 'Hips', 'Core'], 'Improves cardiovascular fitness and knee-drive coordination.', ['Stand tall and alternate lifting knees.', 'Pump opposite arms naturally.', 'Choose a marching or running pace that allows control.'], 'March slowly and lift knees lower.', 'Run lightly with faster arm drive.', 'Do not lean backwards or slam the feet.', 'march'),
    skater: ex('Skater Step', 'cardio', ['Glutes', 'Heart', 'Balance'], 'Develops side-to-side stamina and hip control.', ['Step wide to one side.', 'Bring the other foot behind as a light tap.', 'Push smoothly across to the other side.'], 'Keep the steps small and upright.', 'Add a hop while landing softly.', 'Keep the landing knee tracking over toes.', 'skater'),
    mountainClimber: ex('Mountain Climber', 'cardio', ['Core', 'Shoulders', 'Heart'], 'Combines trunk stability with cardiovascular conditioning.', ['Start in a high plank or incline plank.', 'Drive one knee toward the chest.', 'Switch legs while keeping shoulders over hands.'], 'Use a wall or bench and move slowly.', 'Increase speed without bouncing the hips.', 'Do not let the back sag or hands slide.', 'mountain'),
    fastFeet: ex('Fast Feet', 'cardio', ['Heart', 'Calves', 'Coordination'], 'Improves foot speed and short-burst conditioning.', ['Take a small athletic stance.', 'Make quick, light alternating steps.', 'Keep chest lifted and breathe continuously.'], 'March briskly instead.', 'Add side-to-side travel.', 'Stay light; do not lock the knees.', 'feet'),
    squatReach: ex('Squat to Reach', 'cardio', ['Legs', 'Heart', 'Shoulders'], 'Raises heart rate while training a full-body pattern.', ['Lower into a comfortable squat.', 'Stand and reach arms overhead.', 'Move smoothly and keep knees aligned.'], 'Use a shallow squat and reach forward.', 'Add a calf raise or small jump.', 'Do not rush into poor squat form.', 'squat'),
    reverseLungeKnee: ex('Reverse Lunge to Knee Drive', 'cardio', ['Legs', 'Balance', 'Heart'], 'Builds leg strength, balance and cardiovascular demand.', ['Step back into a controlled lunge.', 'Push through the front foot to stand.', 'Drive the back knee forward before repeating.'], 'Use a toe tap instead of lifting the knee.', 'Add speed or a hop only with excellent control.', 'Keep the standing knee aligned.', 'lunge'),
    burpeeStepback: ex('Step-Back Burpee', 'cardio', ['Full body', 'Heart'], 'Provides full-body conditioning without requiring a jump.', ['Squat and place hands on a stable floor or raised surface.', 'Step feet back to a plank, then step them forward.', 'Stand tall and reach overhead.'], 'Use a wall or bench and omit the plank.', 'Jump feet back and add a small jump at the top.', 'Keep the spine controlled and move at your own pace.', 'burpee'),
    childPose: ex("Child's Pose", 'mobility', ['Back', 'Hips'], 'Gently relaxes the back, hips and shoulders.', ['Start on hands and knees.', 'Sit hips back toward heels.', 'Reach arms forward and breathe slowly.'], 'Place a cushion under the hips or keep hips higher.', 'Walk hands slightly to each side for a side stretch.', 'Use a comfortable knee position and stop if pinching occurs.', 'stretch'),
    catCow: ex('Cat–Cow', 'mobility', ['Spine', 'Core'], 'Moves the spine gently through flexion and extension.', ['Start on hands and knees.', 'Exhale and round the spine comfortably.', 'Inhale and lengthen the chest forward without forcing the lower back.'], 'Use a small range.', 'Add slow hip circles between repetitions.', 'Do not force the neck.', 'catcow'),
    cobra: ex('Low Cobra', 'mobility', ['Chest', 'Abdominals', 'Spine'], 'Opens the front of the body after sitting or core work.', ['Lie face down with hands near the ribs.', 'Press lightly and lengthen the chest forward and up.', 'Keep hips down and lower slowly.'], 'Lift only the chest without pushing the hands.', 'Hold a little longer while breathing comfortably.', 'Avoid compressing the lower back.', 'cobra'),
    hamstringStretch: ex('Hamstring Stretch', 'mobility', ['Hamstrings', 'Calves'], 'Restores comfortable length after leg training.', ['Extend one heel forward with toes up.', 'Hinge from the hips with a long spine.', 'Hold a mild stretch and breathe.'], 'Keep the heel closer and knee slightly bent.', 'Elevate the heel on a low step.', 'Do not bounce or round aggressively.', 'stretch'),
    hipFlexorStretch: ex('Half-Kneeling Hip Flexor Stretch', 'mobility', ['Hip flexors', 'Thighs'], 'Opens the front of the hip after sitting, running or lunging.', ['Kneel with one foot forward and support as needed.', 'Tuck the pelvis gently.', 'Shift forward slightly until the back hip feels a mild stretch.'], 'Perform standing in a split stance.', 'Reach the same-side arm overhead.', 'Do not arch the lower back.', 'lunge'),
    chestOpener: ex('Chest Opener', 'mobility', ['Chest', 'Shoulders'], 'Counters rounded sitting posture and pressing work.', ['Stand tall and place hands behind the back or on the hips.', 'Draw shoulders gently back and down.', 'Lift the breastbone slightly while breathing.'], 'Hold a towel between the hands.', 'Raise clasped hands slightly without shoulder pain.', 'Do not force the shoulders backward.', 'shoulder'),
    figure4: ex('Figure-Four Glute Stretch', 'mobility', ['Glutes', 'Hips'], 'Releases the outer hips and glutes.', ['Sit or lie down and cross one ankle over the opposite thigh.', 'Keep the crossed foot gently flexed.', 'Draw the legs closer until a mild stretch is felt.'], 'Perform seated in a chair.', 'Lie down and draw the supporting thigh closer.', 'Stop if the knee feels pinched.', 'stretch'),
    thoracicRotation: ex('Open-Book Rotation', 'mobility', ['Upper back', 'Chest'], 'Improves upper-back rotation and chest mobility.', ['Lie on one side with hips and knees bent.', 'Reach the top arm across and then open it toward the other side.', 'Follow the hand with the eyes while knees stay together.'], 'Use a smaller arm range.', 'Pause longer in the open position.', 'Do not force the lower back or shoulder.', 'twist'),
    breathing: ex('Slow Recovery Breathing', 'mobility', ['Breathing', 'Nervous system'], 'Helps heart rate settle and reinforces relaxed breathing.', ['Sit or lie comfortably.', 'Inhale gently through the nose.', 'Exhale slowly and allow shoulders and jaw to relax.'], 'Use any comfortable position.', 'Lengthen the exhale slightly without straining.', 'Stop breath holds if dizzy.', 'breathing'),
    downwardDog: ex('Downward Dog Pedal', 'mobility', ['Calves', 'Shoulders', 'Back'], 'Combines shoulder mobility with a moving calf stretch.', ['Start on hands and knees and lift hips.', 'Keep knees bent enough to lengthen the spine.', 'Alternate pressing one heel toward the floor.'], 'Use hands on a wall or bench.', 'Pause longer over each calf.', 'Do not force heels down or collapse shoulders.', 'stretch')
  };

  const PLANS = [
    plan(1, 'Full Body Foundation', 'Balanced strength and movement control', 'Moderate',
      ['march','armCircles','stepTouch','hipCircles','torsoTwist','heelDigs','kneeHugs','ankleRolls'],
      ['squat','inclinePushup','reverseLunge','birdDog','gluteBridge','shoulderTap'],
      ['goodMorning','pushup','calfRaise','deadBug','superman','plank'],
      ['lowJack','squatReach','highKnees','mountainClimber','skater','fastFeet'],
      ['breathing','childPose','hamstringStretch','hipFlexorStretch','chestOpener','figure4','thoracicRotation','breathing']),
    plan(2, 'Stamina + Core', 'Cardiovascular fitness and trunk endurance', 'Moderate–high',
      ['march','stepTouch','armCircles','heelDigs','torsoTwist','hipCircles','kneeHugs','ankleRolls'],
      ['lowJack','highKnees','skater','mountainClimber','fastFeet','squatReach'],
      ['plank','heelTap','bicycle','birdDog','sidePlank','deadBug'],
      ['fastFeet','highKnees','lowJack','skater','mountainClimber','march'],
      ['breathing','childPose','cobra','hamstringStretch','hipFlexorStretch','figure4','thoracicRotation','breathing']),
    plan(3, 'Lower Body + Glutes', 'Leg strength, hip shape and balance', 'Moderate',
      ['march','heelDigs','stepTouch','hipCircles','kneeHugs','ankleRolls','goodMorning','squat'],
      ['squat','reverseLunge','gluteBridge','calfRaise','wallSit','goodMorning'],
      ['sumoSquat','sideLunge','singleLegBridge','curtsyLunge','donkeyKick','fireHydrant'],
      ['squatPulse','skater','reverseLungeKnee','squatReach','calfRaise','highKnees'],
      ['breathing','childPose','hamstringStretch','hipFlexorStretch','figure4','downwardDog','thoracicRotation','breathing']),
    plan(4, 'Upper Body + Posture', 'Chest, back, shoulders, arms and core', 'Moderate',
      ['march','armCircles','torsoTwist','stepTouch','chestOpener','catCow','shoulderTap','ankleRolls'],
      ['inclinePushup','bentRow','shoulderTap','pikePress','tricepsDip','superman'],
      ['pushup','floorPress','reverseFly','plank','sidePlank','birdDog'],
      ['lowJack','mountainClimber','squatReach','fastFeet','highKnees','burpeeStepback'],
      ['breathing','childPose','catCow','cobra','chestOpener','thoracicRotation','figure4','breathing']),
    plan(5, 'Full Body Conditioning', 'Fat-loss support, stamina and athletic movement', 'High with low-impact options',
      ['march','stepTouch','armCircles','heelDigs','hipCircles','torsoTwist','kneeHugs','squat'],
      ['burpeeStepback','squatReach','mountainClimber','reverseLungeKnee','inclinePushup','highKnees'],
      ['skater','squat','shoulderTap','goodMorning','lowJack','plank'],
      ['fastFeet','burpeeStepback','highKnees','skater','mountainClimber','squatReach'],
      ['breathing','childPose','cobra','hamstringStretch','hipFlexorStretch','chestOpener','figure4','breathing']),
    plan(6, 'Body Sculpt + Mobility', 'Controlled strength, balance and recovery', 'Low–moderate',
      ['march','armCircles','stepTouch','hipCircles','catCow','torsoTwist','kneeHugs','ankleRolls'],
      ['sumoSquat','inclinePushup','gluteBridge','bentRow','birdDog','calfRaise'],
      ['sideLunge','reverseFly','singleLegBridge','deadBug','donkeyKick','sidePlank'],
      ['squatPulse','lowJack','shoulderTap','reverseLungeKnee','fastFeet','march'],
      ['breathing','childPose','catCow','downwardDog','hamstringStretch','hipFlexorStretch','chestOpener','figure4'])
  ];

  const MEALS = [
    meals(1, 'Full Body Foundation', [
      ['Breakfast','🥣','Oats cooked with milk, chia seeds, berries and a spoon of peanut butter.','Vegan: use calcium-fortified soy milk.'],
      ['Snack','🍎','Fruit with Greek yoghurt or a handful of nuts.','Vegan: soy yoghurt or nuts.'],
      ['Lunch','🍛','Dal, brown rice or two wholemeal rotis, mixed salad and lemon.','Add extra lentils or tofu for more protein.'],
      ['Pre-workout','🍌','Banana or wholegrain toast 60–90 minutes before training.','Keep the portion light and easy to digest.'],
      ['Dinner','🥦','Tofu or paneer vegetable stir-fry with quinoa or wholegrain noodles.','Vegan: tofu or tempeh.']
    ]),
    meals(2, 'Stamina + Core', [
      ['Breakfast','🫓','Besan chilla with vegetables and yoghurt.','Vegan: use mint chutney or soy yoghurt.'],
      ['Snack','🥜','Banana with peanut butter.','A useful carbohydrate + fat snack before cardio.'],
      ['Lunch','🫘','Rajma with quinoa or brown rice and cucumber-tomato salad.','Include capsicum or lemon for vitamin C.'],
      ['Recovery','🥛','Milk or fortified soy drink with fruit after training.','Choose unsweetened where practical.'],
      ['Dinner','🍲','Vegetable khichdi with extra moong dal and raita.','Vegan: soy yoghurt raita.']
    ]),
    meals(3, 'Lower Body + Glutes', [
      ['Breakfast','🥣','Greek yoghurt bowl with oats, fruit, pumpkin seeds and walnuts.','Vegan: high-protein soy yoghurt.'],
      ['Snack','🌰','Roasted chickpeas and one piece of fruit.','Prepare with modest salt.'],
      ['Lunch','🫓','Chole, two wholemeal rotis and a large mixed vegetable salad.','Add lemon to improve non-haem iron absorption.'],
      ['Pre-workout','🥔','Small boiled potato, fruit or toast before training.','Carbohydrate supports a demanding leg session.'],
      ['Dinner','🍢','Tofu or paneer tikka bowl with vegetables and brown rice.','Vegan: tofu or tempeh.']
    ]),
    meals(4, 'Upper Body + Posture', [
      ['Breakfast','🍚','Vegetable poha with peas, peanuts and a side of yoghurt.','Vegan: soy yoghurt or extra peas.'],
      ['Snack','🥛','Fortified milk or soy drink with a small handful of nuts.','Check calcium and B12 fortification.'],
      ['Lunch','🍝','Lentil pasta with tomato, spinach and mushrooms.','Top with seeds or a little cheese.'],
      ['Snack','🥕','Hummus with carrots, cucumber and wholegrain crackers.','A simple protein-rich snack.'],
      ['Dinner','🥬','Palak tofu or palak paneer with wholemeal roti and salad.','Vegan: calcium-set tofu.']
    ]),
    meals(5, 'Full Body Conditioning', [
      ['Breakfast','🥣','Overnight oats with milk, chia, banana and cinnamon.','Vegan: fortified soy milk.'],
      ['Pre-workout','🍌','Banana, dates or toast before training.','Avoid a very heavy meal immediately before HIIT.'],
      ['Lunch','🌯','Chickpea salad wrap with hummus, colourful vegetables and wholegrain flatbread.','Add tofu strips for extra protein.'],
      ['Recovery','🥤','Fruit-and-soy smoothie or yoghurt with fruit.','Include a protein source after training.'],
      ['Dinner','🍛','Mixed dal, rice, vegetables and cucumber salad.','Keep oils moderate if fat loss is the goal.']
    ]),
    meals(6, 'Body Sculpt + Mobility', [
      ['Breakfast','🥤','Smoothie with fortified soy or dairy milk, oats, berries and nut butter.','Use whole fruit rather than juice.'],
      ['Snack','🍊','Orange or kiwi with pumpkin seeds.','Vitamin C supports plant-iron absorption.'],
      ['Lunch','🥘','Sambar with idli or dosa and extra vegetables.','Add lentils generously for protein.'],
      ['Snack','🥛','Lassi, soy yoghurt or a small handful of nuts.','Choose unsweetened or lightly sweetened.'],
      ['Dinner','🍲','Vegetable curry with tofu, chickpeas or paneer and a wholegrain side.','Vegan: tofu plus chickpeas.']
    ]),
    meals(7, 'Recovery Day', [
      ['Breakfast','🍞','Wholegrain toast with avocado and eggs or tofu scramble.','Vegan: tofu scramble.'],
      ['Snack','🍐','Fruit and nuts.','Keep hydration steady through the day.'],
      ['Lunch','🥗','Large lentil and grain salad with colourful vegetables and tahini dressing.','Add lemon and herbs.'],
      ['Snack','🥣','Yoghurt or soy yoghurt with seeds.','Choose a fortified option when possible.'],
      ['Dinner','🍲','Vegetable and bean soup with wholegrain bread.','A lighter recovery-day dinner.']
    ])
  ];

  let state = loadState();
  let currentPage = 'home';
  let activePlan = null;
  let session = [];
  let stepIndex = 0;
  let remaining = 60;
  let timerId = null;
  let isPlaying = false;
  let deferredInstallPrompt = null;
  let toastTimer = null;

  const $ = (id) => document.getElementById(id);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  function ex(name, category, muscles, benefit, steps, easier, harder, caution, animation) {
    return { name, category, muscles, benefit, steps, easier, harder, caution, animation };
  }
  function plan(day, title, focus, intensity, warmup, circuitA, circuitB, finisher, cooldown) {
    return { day, title, focus, intensity, warmup, circuitA, circuitB, finisher, cooldown };
  }
  function meals(day, focus, items) { return { day, focus, items }; }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return { ...DEFAULT_STATE, ...(parsed || {}) };
    } catch (error) {
      console.warn('Could not read saved state', error);
      return { ...DEFAULT_STATE };
    }
  }

  function saveState(message) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    applyTheme();
    renderAll();
    if (message) showToast(message);
  }

  function init() {
    applyTheme();
    bindEvents();
    renderAll();
    $('checkinDate').value = isoDate(new Date());
    registerServiceWorker();
    updateNetworkBadge();
    showPage('home');
  }

  function bindEvents() {
    document.addEventListener('click', (event) => {
      const go = event.target.closest('[data-go]');
      if (go) showPage(go.dataset.go);
    });
    $$('.nav-btn').forEach((btn) => btn.addEventListener('click', () => showPage(btn.dataset.go)));
    $('startTodayBtn').addEventListener('click', () => startWorkout(state.currentDay));
    $('openMealBtn').addEventListener('click', () => { $('mealDaySelect').value = String(state.currentDay); renderMeals(); showPage('meals'); });
    $('closeWorkoutBtn').addEventListener('click', () => stopTimerAndClose());
    $('playPauseBtn').addEventListener('click', toggleTimer);
    $('nextStepBtn').addEventListener('click', nextStep);
    $('prevStepBtn').addEventListener('click', previousStep);
    $('playerInfoBtn').addEventListener('click', () => openExerciseDialog(session[stepIndex]?.exerciseId));
    $('easierBtn').addEventListener('click', () => showToast($('easierCue').textContent));
    $('harderBtn').addEventListener('click', () => showToast($('harderCue').textContent));
    $('exerciseSearch').addEventListener('input', renderExerciseLibrary);
    $('exerciseFilter').addEventListener('change', renderExerciseLibrary);
    $('mealDaySelect').addEventListener('change', renderMeals);
    $$('.segment').forEach(btn => btn.addEventListener('click', () => {
      state.diet = btn.dataset.diet;
      saveState();
      renderMeals();
    }));
    $('closeDialogBtn').addEventListener('click', () => $('exerciseDialog').close());
    $('settingsForm').addEventListener('submit', saveSettingsFromForm);
    $('safetyAck').addEventListener('change', (e) => { state.safetyAck = e.target.checked; saveState('Safety acknowledgement saved'); });
    $('checkinForm').addEventListener('submit', saveCheckin);
    $('installBtn').addEventListener('click', installApp);
    $('exportBtn').addEventListener('click', exportBackup);
    $('importInput').addEventListener('change', importBackup);
    $('resetBtn').addEventListener('click', resetApp);
    $('updateBtn').addEventListener('click', checkForUpdate);
    window.addEventListener('online', updateNetworkBadge);
    window.addEventListener('offline', updateNetworkBadge);
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      $('installBtn').disabled = false;
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isPlaying) pauseTimer();
    });
  }

  function renderAll() {
    renderHome();
    renderPlan();
    renderExerciseLibrary();
    renderMealOptions();
    renderMeals();
    renderProgress();
    renderSettings();
  }

  function showPage(page) {
    currentPage = page;
    $$('.page').forEach((el) => el.classList.toggle('active', el.dataset.page === page));
    $$('.nav-btn').forEach((el) => el.classList.toggle('active', el.dataset.go === page));
    $('mainContent').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderHome() {
    const plan = PLANS.find(p => p.day === state.currentDay) || PLANS[0];
    const completed = uniqueCompletedDays().length;
    const pct = Math.round((completed / 6) * 100);
    $('todayTitle').textContent = `Day ${plan.day} · ${plan.title}`;
    $('todaySummary').textContent = GOALS[state.goal]?.note || plan.focus;
    $('todayIntensity').textContent = plan.intensity;
    $('todayGoalPill').textContent = GOALS[state.goal]?.label || 'General fitness';
    $('goalGuideTitle').textContent = GOALS[state.goal]?.label || 'General fitness';
    $('goalGuideText').textContent = goalGuideText(state.goal);
    $('weekProgressRing').textContent = `${pct}%`;
    $('weekProgressRing').parentElement.style.setProperty('--progress', `${pct}%`);
    const summary = workoutSummary();
    $('completedCount').textContent = summary.weekCount;
    $('activeMinutes').textContent = summary.minutes;
    $('currentStreak').textContent = summary.streak;

    $('weekStrip').innerHTML = '';
    for (let day = 1; day <= 7; day++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `week-day ${day === state.currentDay ? 'today' : ''} ${state.completedDays.includes(day) ? 'done' : ''} ${day === 7 ? 'rest' : ''}`;
      btn.innerHTML = `<strong>${day === 7 ? 'Rest' : `D${day}`}</strong><small>${day === 7 ? 'Recover' : PLANS[day - 1].title.split(' ')[0]}</small>`;
      btn.addEventListener('click', () => {
        if (day === 7) { $('mealDaySelect').value = '7'; renderMeals(); showPage('meals'); }
        else startWorkout(day);
      });
      $('weekStrip').appendChild(btn);
    }
  }

  function renderPlan() {
    const container = $('planList');
    container.innerHTML = '';
    PLANS.forEach((p) => {
      const card = document.createElement('article');
      card.className = `plan-card ${state.completedDays.includes(p.day) ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="day-badge">${state.completedDays.includes(p.day) ? '✓' : `D${p.day}`}</div>
        <div><h3>${p.title}</h3><p>${p.focus}</p><div class="plan-meta"><span>60 minutes</span><span>•</span><span>${p.intensity}</span><span>•</span><span>Animated guidance</span></div></div>
        <button type="button">${state.completedDays.includes(p.day) ? 'Repeat' : 'Start'}</button>`;
      card.querySelector('button').addEventListener('click', () => startWorkout(p.day));
      container.appendChild(card);
    });
    const rest = document.createElement('article');
    rest.className = 'plan-card';
    rest.innerHTML = `<div class="day-badge">D7</div><div><h3>Recovery Day</h3><p>Easy walking, gentle mobility, hydration, nutritious food and 7–9 hours of sleep.</p><div class="plan-meta"><span>20–40 minutes easy movement</span><span>•</span><span>No hard training</span></div></div><button type="button">Meals</button>`;
    rest.querySelector('button').addEventListener('click', () => { $('mealDaySelect').value = '7'; renderMeals(); showPage('meals'); });
    container.appendChild(rest);
  }

  function renderExerciseLibrary() {
    const query = ($('exerciseSearch')?.value || '').toLowerCase().trim();
    const filter = $('exerciseFilter')?.value || 'all';
    const container = $('exerciseLibrary');
    if (!container) return;
    const entries = Object.entries(EXERCISES).filter(([, item]) => {
      const haystack = `${item.name} ${item.category} ${item.muscles.join(' ')} ${item.benefit}`.toLowerCase();
      return (filter === 'all' || item.category === filter) && (!query || haystack.includes(query));
    });
    container.innerHTML = '';
    entries.forEach(([id, item]) => {
      const card = document.createElement('article');
      card.className = 'exercise-card';
      card.innerHTML = `<button type="button"><div class="mini-visual">${makeAnimation(item.animation)}</div><div class="card-copy"><p class="eyebrow">${item.category.toUpperCase()}</p><h3>${item.name}</h3><p>${item.benefit}</p></div></button>`;
      card.querySelector('button').addEventListener('click', () => openExerciseDialog(id));
      container.appendChild(card);
    });
    if (!entries.length) container.innerHTML = '<div class="notice"><strong>No matching exercise</strong><p>Try another body area or category.</p></div>';
  }

  function renderMealOptions() {
    const select = $('mealDaySelect');
    if (!select || select.options.length) return;
    MEALS.forEach(m => {
      const option = document.createElement('option');
      option.value = String(m.day);
      option.textContent = `Day ${m.day}: ${m.focus}`;
      select.appendChild(option);
    });
    select.value = String(state.currentDay);
  }

  function renderMeals() {
    const selected = Number($('mealDaySelect')?.value || state.currentDay);
    const mealPlan = MEALS.find(m => m.day === selected) || MEALS[0];
    $$('.segment').forEach(btn => btn.classList.toggle('active', btn.dataset.diet === state.diet));
    const container = $('mealCards');
    if (!container) return;
    container.innerHTML = '';
    mealPlan.items.forEach(([type, icon, meal, alternative]) => {
      const card = document.createElement('article');
      card.className = 'meal-card';
      const line = state.diet === 'vegan' ? alternative : alternative.replace(/^Vegan:\s*/i, 'Alternative: ');
      card.innerHTML = `<div class="meal-icon">${icon}</div><div><p class="eyebrow">${type.toUpperCase()}</p><h3>${meal}</h3><small>${line}</small></div>`;
      container.appendChild(card);
    });
    $('proteinFocus').textContent = selected === 5 ? 'Prioritise a protein-rich recovery meal after conditioning' : 'Include a protein source at every main meal';
    $('timingTip').textContent = selected === 7 ? 'Focus on regular balanced meals and hydration' : 'Eat a light carbohydrate snack 60–90 minutes before training';
  }

  function renderProgress() {
    const summary = workoutSummary();
    $('progressWorkouts').textContent = state.workouts.length;
    $('progressMinutes').textContent = summary.totalMinutes;
    $('progressStreak').textContent = summary.streak;
    const container = $('checkinHistory');
    container.innerHTML = '';
    const sorted = [...state.checkins].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 12);
    if (!sorted.length) {
      container.innerHTML = '<p class="muted">No check-ins saved yet. Consistency and how you feel matter more than daily scale changes.</p>';
      return;
    }
    sorted.forEach((item) => {
      const row = document.createElement('article');
      row.className = 'history-item';
      const values = [item.weight ? `${item.weight} kg` : '', item.waist ? `${item.waist} cm waist` : '', item.pulse ? `${item.pulse} bpm` : '', item.notes || ''].filter(Boolean).join(' · ');
      row.innerHTML = `<div class="history-date">${formatDate(item.date)}</div><div class="history-values">${values || 'Check-in saved'}</div><button type="button" aria-label="Delete check-in">×</button>`;
      row.querySelector('button').addEventListener('click', () => {
        state.checkins = state.checkins.filter(c => c.id !== item.id);
        saveState('Check-in deleted');
      });
      container.appendChild(row);
    });
  }

  function renderSettings() {
    $('goalSelect').value = state.goal;
    $('levelSelect').value = state.level;
    $('equipmentSelect').value = state.equipment;
    $('themeSelect').value = state.theme;
    $('soundSelect').value = state.sound;
    $('safetyAck').checked = Boolean(state.safetyAck);
    $('appVersion').textContent = APP_VERSION;
  }

  function saveSettingsFromForm(event) {
    event.preventDefault();
    state.goal = $('goalSelect').value;
    state.level = $('levelSelect').value;
    state.equipment = $('equipmentSelect').value;
    state.theme = $('themeSelect').value;
    state.sound = $('soundSelect').value;
    saveState('Settings saved');
  }

  function saveCheckin(event) {
    event.preventDefault();
    const date = $('checkinDate').value;
    const weight = $('checkinWeight').value;
    const waist = $('checkinWaist').value;
    const pulse = $('checkinPulse').value;
    const notes = $('checkinNotes').value.trim();
    if (!date) return showToast('Choose a date');
    if (!weight && !waist && !pulse && !notes) return showToast('Add at least one measurement or note');
    state.checkins.push({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, date, weight, waist, pulse, notes });
    event.target.reset();
    $('checkinDate').value = isoDate(new Date());
    saveState('Check-in saved');
  }

  function startWorkout(day) {
    const p = PLANS.find(x => x.day === day);
    if (!p) return;
    if (!state.safetyAck) showToast('Review the safety guidance in Settings when convenient');
    activePlan = p;
    session = buildSession(p);
    stepIndex = 0;
    remaining = session[0].duration;
    isPlaying = false;
    clearInterval(timerId);
    $('workoutEmpty').classList.add('hidden');
    $('workoutPlayer').classList.remove('hidden');
    showPage('workout');
    renderPlayer();
  }

  function buildSession(p) {
    const items = [];
    p.warmup.forEach(id => items.push(step(id, 'Warm-up', 60, 'continuous')));
    for (let round = 1; round <= 3; round++) p.circuitA.forEach(id => items.push(step(id, `Circuit A · Round ${round}/3`, 60, 'interval')));
    items.push({ exerciseId: null, name: 'Hydration + transition', phase: 'Two-minute transition', duration: 120, mode: 'transition' });
    for (let round = 1; round <= 3; round++) p.circuitB.forEach(id => items.push(step(id, `Circuit B · Round ${round}/3`, 60, 'interval')));
    p.finisher.forEach(id => items.push(step(id, 'Six-minute finisher', 60, 'interval')));
    p.cooldown.forEach(id => items.push(step(id, 'Cool-down', 60, 'continuous')));
    return items;
  }

  function step(exerciseId, phase, duration, mode) {
    return { exerciseId, name: EXERCISES[exerciseId].name, phase, duration, mode };
  }

  function renderPlayer() {
    const current = session[stepIndex];
    if (!current) return;
    $('playerDay').textContent = `DAY ${activePlan.day}`;
    $('playerWorkoutTitle').textContent = activePlan.title;
    $('phaseLabel').textContent = current.phase;
    $('stepCounter').textContent = `${stepIndex + 1} of ${session.length}`;
    $('sessionProgressBar').style.width = `${((stepIndex + (1 - remaining/current.duration)) / session.length) * 100}%`;
    const isIntervalRest = current.mode === 'interval' && remaining <= restSeconds();
    const timerState = $('timerState');
    timerState.classList.toggle('rest', isIntervalRest || current.mode === 'transition');
    timerState.textContent = current.mode === 'transition' ? 'RECOVER' : isIntervalRest ? 'REST / CHANGE' : current.phase === 'Cool-down' ? 'STRETCH' : 'MOVE';
    $('timerDisplay').textContent = formatTime(remaining);
    $('playPauseBtn').textContent = isPlaying ? '❚❚' : '▶';

    if (current.exerciseId) {
      const item = EXERCISES[current.exerciseId];
      $('exerciseVisual').innerHTML = makeAnimation(item.animation);
      $('exerciseVisual').classList.toggle('resting', isIntervalRest);
      $('exerciseName').textContent = item.name;
      $('exerciseCue').textContent = item.steps[0] + ' ' + item.steps[1];
      $('targetMuscles').innerHTML = item.muscles.map(m => `<span>${m}</span>`).join('');
      $('easierCue').textContent = item.easier;
      $('harderCue').textContent = item.harder;
      $('playerInfoBtn').disabled = false;
    } else {
      $('exerciseVisual').innerHTML = makeAnimation('breathing');
      $('exerciseName').textContent = 'Hydration + transition';
      $('exerciseCue').textContent = 'Sip water, breathe slowly and prepare for the next circuit. Keep moving gently rather than sitting suddenly.';
      $('targetMuscles').innerHTML = '<span>Recovery</span><span>Hydration</span>';
      $('easierCue').textContent = 'Walk slowly and focus on breathing.';
      $('harderCue').textContent = 'Do not make recovery harder—use it to improve the next circuit.';
      $('playerInfoBtn').disabled = true;
    }
  }

  function toggleTimer() {
    if (isPlaying) pauseTimer(); else playTimer();
  }

  function playTimer() {
    if (!session.length) return;
    isPlaying = true;
    beep(720, .08);
    clearInterval(timerId);
    timerId = setInterval(() => {
      remaining -= 1;
      if (remaining === restSeconds() && session[stepIndex].mode === 'interval') beep(540, .12);
      if (remaining <= 0) {
        beep(880, .13);
        advanceStepAutomatically();
      } else renderPlayer();
    }, 1000);
    renderPlayer();
  }

  function pauseTimer() {
    isPlaying = false;
    clearInterval(timerId);
    timerId = null;
    renderPlayer();
  }

  function nextStep() {
    pauseTimer();
    if (stepIndex >= session.length - 1) return completeWorkout();
    stepIndex += 1;
    remaining = session[stepIndex].duration;
    renderPlayer();
  }

  function previousStep() {
    pauseTimer();
    stepIndex = Math.max(0, stepIndex - 1);
    remaining = session[stepIndex].duration;
    renderPlayer();
  }

  function advanceStepAutomatically() {
    if (stepIndex >= session.length - 1) {
      pauseTimer();
      completeWorkout();
      return;
    }
    stepIndex += 1;
    remaining = session[stepIndex].duration;
    renderPlayer();
  }

  function completeWorkout() {
    pauseTimer();
    const day = activePlan.day;
    const now = new Date();
    state.completedDays = [...new Set([...state.completedDays, day])].sort();
    state.currentDay = day < 6 ? day + 1 : 6;
    state.workouts.push({ id: `${Date.now()}-${day}`, date: isoDate(now), timestamp: now.toISOString(), day, title: activePlan.title, minutes: 60, goal: state.goal, level: state.level });
    saveState('Workout completed — excellent consistency');
    $('workoutPlayer').classList.add('hidden');
    $('workoutEmpty').classList.remove('hidden');
    showPage('progress');
  }

  function stopTimerAndClose() {
    pauseTimer();
    $('workoutPlayer').classList.add('hidden');
    $('workoutEmpty').classList.remove('hidden');
    showPage('plan');
  }

  function restSeconds() { return state.level === 'intermediate' ? 15 : 25; }

  function openExerciseDialog(id) {
    const item = EXERCISES[id];
    if (!item) return;
    $('dialogVisual').innerHTML = makeAnimation(item.animation);
    $('dialogCategory').textContent = item.category.toUpperCase();
    $('dialogTitle').textContent = item.name;
    $('dialogTags').innerHTML = item.muscles.map(m => `<span>${m}</span>`).join('');
    $('dialogBenefit').textContent = item.benefit;
    $('dialogSteps').innerHTML = item.steps.map(s => `<li>${s}</li>`).join('');
    $('dialogEasier').textContent = item.easier;
    $('dialogHarder').textContent = item.harder;
    $('dialogCaution').textContent = item.caution;
    $('exerciseDialog').showModal();
  }

  function makeAnimation(type) {
    const poses = animationPoses(type);
    const draw = (pose, className) => `
      <g class="${className}">
        <circle class="figure-head" cx="${pose.head[0]}" cy="${pose.head[1]}" r="15" />
        <path class="figure-line" d="M ${pose.neck[0]} ${pose.neck[1]} L ${pose.hip[0]} ${pose.hip[1]}" />
        <path class="figure-line figure-accent" d="M ${pose.neck[0]} ${pose.neck[1]} L ${pose.leftHand[0]} ${pose.leftHand[1]}" />
        <path class="figure-line figure-accent" d="M ${pose.neck[0]} ${pose.neck[1]} L ${pose.rightHand[0]} ${pose.rightHand[1]}" />
        <path class="figure-line" d="M ${pose.hip[0]} ${pose.hip[1]} L ${pose.leftFoot[0]} ${pose.leftFoot[1]}" />
        <path class="figure-line" d="M ${pose.hip[0]} ${pose.hip[1]} L ${pose.rightFoot[0]} ${pose.rightFoot[1]}" />
      </g>`;
    return `<svg class="exercise-svg" viewBox="0 0 320 220" role="img" aria-label="Animated two-position exercise demonstration"><line class="figure-ground" x1="35" y1="195" x2="285" y2="195" />${draw(poses[0], 'pose-a')}${draw(poses[1], 'pose-b')}</svg>`;
  }

  function animationPoses(type) {
    const stand = pose([160,45],[160,63],[160,125],[115,103],[205,103],[130,192],[190,192]);
    const wide = pose([160,45],[160,63],[160,125],[95,85],[225,85],[100,192],[220,192]);
    const squatA = stand;
    const squatB = pose([160,77],[160,93],[160,142],[110,118],[210,118],[105,192],[215,192]);
    const lungeA = stand;
    const lungeB = pose([150,57],[150,73],[145,126],[112,100],[198,98],[105,192],[230,180]);
    const plankA = pose([80,91],[96,99],[170,135],[85,145],[115,145],[255,190],[230,190]);
    const plankB = pose([85,91],[101,99],[170,135],[85,145],[115,145],[210,151],[255,190]);
    const pushA = pose([75,110],[92,115],[168,140],[86,170],[120,170],[260,190],[235,190]);
    const pushB = pose([90,140],[108,143],[175,155],[105,185],[135,185],[260,190],[235,190]);
    const bridgeA = pose([87,153],[103,153],[165,170],[95,183],[126,183],[225,190],[195,190]);
    const bridgeB = pose([90,124],[107,125],[170,125],[97,179],[128,179],[225,190],[195,190]);
    const crunchA = pose([93,158],[110,159],[165,171],[105,184],[130,184],[220,190],[190,190]);
    const crunchB = pose([108,130],[125,135],[170,165],[115,177],[140,177],[220,190],[190,190]);
    const birdA = pose([142,87],[142,103],[150,140],[100,170],[184,165],[120,190],[205,190]);
    const birdB = pose([142,87],[142,103],[150,140],[65,104],[184,165],[120,190],[250,125]);
    const hingeA = stand;
    const hingeB = pose([112,83],[125,88],[170,126],[95,126],[202,126],[130,192],[190,192]);
    const sideA = pose([160,45],[160,63],[160,125],[120,97],[200,97],[140,192],[180,192]);
    const sideB = pose([153,78],[153,95],[153,137],[120,110],[200,110],[120,192],[195,192]);
    const map = {
      squat: [squatA, squatB], lunge: [lungeA, lungeB], pushup: [pushA, pushB], plank: [plankA, plankB],
      sideplank: [pose([105,104],[120,110],[170,145],[112,175],[140,175],[245,190],[220,190]), pose([95,65],[112,75],[165,130],[90,170],[140,170],[245,190],[220,190])],
      bridge: [bridgeA, bridgeB], crunch: [crunchA, crunchB], deadbug: [pose([160,78],[160,95],[160,145],[120,95],[200,95],[130,165],[190,165]), pose([160,78],[160,95],[160,145],[75,70],[200,95],[130,165],[245,190])],
      bird: [birdA, birdB], hinge: [hingeA, hingeB], row: [hingeB, pose([112,83],[125,88],[170,126],[130,115],[178,112],[130,192],[190,192])],
      press: [pose([160,147],[160,162],[160,175],[120,135],[200,135],[130,192],[190,192]), pose([160,147],[160,162],[160,175],[130,82],[190,82],[130,192],[190,192])],
      shoulder: [stand, pose([160,45],[160,63],[160,125],[100,48],[220,48],[130,192],[190,192])],
      jack: [stand, wide], march: [stand, pose([160,45],[160,63],[160,125],[110,80],[210,115],[130,192],[190,142])],
      mountain: [plankA, pose([80,91],[96,99],[170,135],[85,145],[115,145],[205,150],[245,190])],
      skater: [pose([135,58],[135,75],[145,132],[95,115],[188,103],[100,192],[205,175]), pose([185,58],[185,75],[175,132],[132,103],[225,115],[115,175],[220,192])],
      feet: [pose([155,48],[155,65],[160,125],[120,105],[200,105],[140,190],[180,185]), pose([165,48],[165,65],[160,125],[120,105],[200,105],[140,185],[180,190])],
      wall: [pose([155,67],[155,83],[155,140],[120,112],[190,112],[110,190],[205,190]), pose([155,80],[155,96],[155,145],[120,118],[190,118],[115,190],[205,190])],
      calf: [stand, pose([160,40],[160,58],[160,120],[115,98],[205,98],[135,180],[185,180])],
      dip: [pose([130,88],[130,105],[155,135],[115,145],[185,145],[120,190],[210,190]), pose([130,115],[130,130],[155,150],[115,170],[185,170],[120,190],[210,190])],
      superman: [pose([85,155],[103,156],[165,168],[80,185],[125,184],[235,190],[205,190]), pose([90,125],[108,130],[165,160],[65,115],[120,150],[250,150],[205,185])],
      burpee: [stand, plankA], balance: [stand, pose([160,45],[160,63],[160,125],[115,100],[205,100],[130,192],[190,142])],
      twist: [stand, pose([160,45],[160,63],[160,125],[90,80],[230,125],[130,192],[190,192])],
      mobility: [stand, wide], catcow: [birdA, pose([142,105],[142,120],[150,145],[100,170],[184,165],[120,190],[205,190])],
      cobra: [pose([90,155],[108,157],[170,172],[105,190],[130,190],[245,190],[215,190]), pose([110,105],[125,115],[170,165],[105,180],[140,180],[245,190],[215,190])],
      stretch: [stand, hingeB], breathing: [stand, sideA]
    };
    return map[type] || [stand, wide];
  }

  function pose(head, neck, hip, leftHand, rightHand, leftFoot, rightFoot) {
    return { head, neck, hip, leftHand, rightHand, leftFoot, rightFoot };
  }

  function goalGuideText(goal) {
    const guides = {
      general: 'Complete the six varied sessions, use easier options when needed, and keep Day 7 restorative. Balanced fitness comes from strength, cardio, mobility, daily light movement and sleep.',
      fat: 'The app combines strength and conditioning because preserving muscle and increasing total activity supports sustainable body-fat reduction. Food portions, protein-rich meals, sleep and consistency matter more than punishing workouts.',
      stamina: 'Stay at a pace where technique remains controlled. Over several weeks, progress from marching to faster variations, or from beginner intervals to intermediate intervals, rather than increasing everything at once.',
      shape: 'Body shape changes through muscle development and overall body-fat change. Use slow, controlled repetitions, complete the full range you can manage and add dumbbells only when technique is stable.',
      strength: 'Strength improves when the same movement becomes more controlled or gradually more difficult. First improve form, then add repetitions, slower lowering, longer holds or modest resistance.'
    };
    return guides[goal] || guides.general;
  }

  function workoutSummary() {
    const totalMinutes = state.workouts.reduce((sum, w) => sum + Number(w.minutes || 0), 0);
    const weekCount = uniqueCompletedDays().length;
    const minutes = state.workouts.filter(w => daysAgo(w.date) <= 7).reduce((sum,w) => sum + Number(w.minutes || 0), 0);
    const dates = [...new Set(state.workouts.map(w => w.date))].sort().reverse();
    let streak = 0;
    if (dates.length) {
      let cursor = new Date();
      if (!dates.includes(isoDate(cursor))) cursor.setDate(cursor.getDate() - 1);
      while (dates.includes(isoDate(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
    }
    return { totalMinutes, weekCount, minutes, streak };
  }

  function uniqueCompletedDays() { return [...new Set(state.completedDays.filter(d => d >= 1 && d <= 6))]; }

  function applyTheme() { document.documentElement.dataset.theme = state.theme || 'system'; }

  function exportBackup() {
    const blob = new Blob([JSON.stringify({ app: APP_VERSION, exportedAt: new Date().toISOString(), state }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health-app-backup-${isoDate(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Backup exported');
  }

  async function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const imported = parsed.state || parsed;
      state = { ...DEFAULT_STATE, ...imported };
      saveState('Backup imported');
    } catch (error) {
      console.error(error);
      showToast('This backup could not be imported');
    } finally { event.target.value = ''; }
  }

  function resetApp() {
    if (!confirm('Reset all workouts, settings and check-ins on this device?')) return;
    state = { ...DEFAULT_STATE };
    localStorage.removeItem(STORAGE_KEY);
    saveState('App data reset');
    showPage('home');
  }

  async function installApp() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      return;
    }
    showToast('On iPhone: Share → Add to Home Screen');
  }

  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) showToast('New app version available — tap update');
        });
      });
    } catch (error) { console.warn('Service worker registration failed', error); }
  }

  async function checkForUpdate() {
    if (!('serviceWorker' in navigator)) return location.reload();
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      await registration?.update();
      if (registration?.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => !k.includes(APP_VERSION)).map(k => caches.delete(k)));
      showToast('App refreshed to the latest available version');
      setTimeout(() => location.reload(), 450);
    } catch (error) {
      console.error(error);
      showToast('Update check failed — your saved data is safe');
    }
  }

  function updateNetworkBadge() {
    const online = navigator.onLine;
    $('networkBadge').textContent = online ? 'Online · offline ready' : 'Offline mode';
    $('networkBadge').style.color = online ? 'var(--success)' : 'var(--accent)';
  }

  function beep(frequency, duration) {
    if (state.sound !== 'on') return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
    } catch (_) {}
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').classList.add('show');
    toastTimer = setTimeout(() => $('toast').classList.remove('show'), 2400);
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = Math.max(0, seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  function isoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatDate(value) {
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function daysAgo(value) {
    const then = new Date(`${value}T00:00:00`);
    const now = new Date(); now.setHours(0,0,0,0);
    return Math.floor((now - then) / 86400000);
  }

  init();
})();
