(() => {
'use strict';
const TAU=Math.PI*2;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t*t*(3-2*t);
const wave=t=>Math.sin(TAU*t);
const pulse=t=>(1-Math.cos(TAU*t))/2;
const deg=d=>d*Math.PI/180;
const vec=(angle,len)=>({x:Math.cos(deg(angle))*len,y:Math.sin(deg(angle))*len});
const add=(a,b)=>({x:a.x+b.x,y:a.y+b.y});
const avg=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
const dist=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);

const SPEED={
 breathing:4.6,childPose:4.2,hamstringStretch:3.8,hipFlexorStretch:3.8,figure4:4,wallSit:3.6,plank:3.4,sidePlank:3.4,
 highKnees:1.05,fastFeet:.8,mountainClimber:1.25,lowJack:1.45,skater:1.55,burpeeStepback:3.4,
 armCircles:2.2,ankleRolls:2.6,catCow:3.2,thoracicRotation:3.3
};

const TARGETS={
 march:['Quads','Hip flexors','Calves','Core'],armCircles:['Shoulders','Upper back'],stepTouch:['Glutes','Outer thighs','Calves'],hipCircles:['Hips','Core'],torsoTwist:['Core','Obliques','Back'],heelDigs:['Hamstrings','Calves'],kneeHugs:['Hip flexors','Glutes','Core'],ankleRolls:['Calves','Ankles'],
 squat:['Quads','Glutes','Hamstrings'],sumoSquat:['Inner thighs','Glutes','Quads'],squatPulse:['Quads','Glutes'],reverseLunge:['Quads','Glutes','Hamstrings'],sideLunge:['Glutes','Inner thighs','Quads'],curtsyLunge:['Glutes','Quads'],gluteBridge:['Glutes','Hamstrings','Core'],singleLegBridge:['Glutes','Hamstrings','Core'],calfRaise:['Calves'],wallSit:['Quads','Glutes','Core'],goodMorning:['Hamstrings','Glutes','Back'],donkeyKick:['Glutes','Hamstrings'],fireHydrant:['Glutes','Hips'],
 inclinePushup:['Chest','Shoulders','Triceps','Core'],pushup:['Chest','Shoulders','Triceps','Core'],pikePress:['Shoulders','Triceps','Upper back'],shoulderTap:['Shoulders','Core','Chest'],tricepsDip:['Triceps','Shoulders','Chest'],bentRow:['Upper back','Biceps','Rear shoulders'],reverseFly:['Rear shoulders','Upper back'],floorPress:['Chest','Triceps','Shoulders'],superman:['Back','Glutes','Shoulders'],
 plank:['Core','Shoulders','Glutes'],sidePlank:['Obliques','Shoulders','Glutes'],deadBug:['Core','Hip flexors'],birdDog:['Core','Back','Glutes'],heelTap:['Core','Obliques'],bicycle:['Core','Obliques','Hip flexors'],crunch:['Core'],
 lowJack:['Shoulders','Glutes','Calves'],highKnees:['Quads','Hip flexors','Core','Calves'],skater:['Glutes','Outer thighs','Core'],mountainClimber:['Core','Shoulders','Hip flexors'],fastFeet:['Calves','Quads','Core'],squatReach:['Quads','Glutes','Shoulders'],reverseLungeKnee:['Quads','Glutes','Hip flexors','Core'],burpeeStepback:['Full body','Core','Shoulders','Legs'],
 childPose:['Back','Hips','Shoulders'],catCow:['Spine','Core','Back'],cobra:['Chest','Back','Shoulders'],hamstringStretch:['Hamstrings','Calves','Back'],hipFlexorStretch:['Hip flexors','Quads','Glutes'],chestOpener:['Chest','Shoulders','Upper back'],figure4:['Glutes','Hips'],thoracicRotation:['Upper back','Shoulders','Core'],breathing:['Diaphragm','Core'],downwardDog:['Shoulders','Back','Hamstrings','Calves']
};

function baseFront(){return{x:300,y:326,torso:-90,scale:1,view:'front',sw:94,hw:58,lua:101,lfa:95,rua:79,rfa:85,lth:94,lsh:90,rth:86,rsh:90,lfoot:180,rfoot:0,head:0,curve:0,depth:0};}
function baseSide(){return{x:342,y:336,torso:180,scale:1,view:'side',sw:42,hw:30,lua:92,lfa:88,rua:92,rfa:88,lth:22,lsh:18,rth:18,rsh:14,lfoot:0,rfoot:0,head:0,curve:0,depth:0};}
function copy(p){return{...p};}
function bendStanding(t,amount=1){const p=baseFront(),q=ease(pulse(t));p.y+=88*q*amount;p.lth=lerp(94,145,q);p.lsh=lerp(90,56,q);p.rth=lerp(86,35,q);p.rsh=lerp(90,124,q);p.lua=lerp(101,142,q);p.rua=lerp(79,38,q);p.lfa=lerp(95,86,q);p.rfa=lerp(85,94,q);return p;}
function marchPose(t,height=1,speed=1){const p=baseFront(),s=Math.sin(TAU*t*speed),l=clamp(s),r=clamp(-s);p.y-=5*Math.abs(s);p.lth=94-197*l*height;p.lsh=90+4*l;p.rth=86-197*r*height;p.rsh=90-4*r;p.lua=101-118*r;p.lfa=95-54*r;p.rua=79+118*l;p.rfa=85+54*l;p.head=3*s;return p;}
function frontLean(p,degAmt){p.torso+=degAmt;return p;}

const POSES={
 march:t=>marchPose(t,.58),
 highKnees:t=>marchPose(t,1),
 fastFeet:t=>marchPose((t*1.8)%1,.28),
 kneeHugs:t=>{const p=marchPose(t,.82),s=Math.sin(TAU*t),l=clamp(s),r=clamp(-s);if(l){p.lua=-58;p.lfa=35;p.rua=-122;p.rfa=145;}if(r){p.lua=-58;p.lfa=35;p.rua=-122;p.rfa=145;}return p;},
 heelDigs:t=>{const p=baseFront(),s=Math.sin(TAU*t),l=clamp(s),r=clamp(-s);p.y+=5*Math.abs(s);p.lth=94-35*l;p.lsh=90-44*l;p.rth=86+35*r;p.rsh=90+44*r;p.lua=101-55*r;p.rua=79+55*l;return p;},
 armCircles:t=>{const p=baseFront(),a=360*t;p.lua=180+a;p.lfa=180+a;p.rua=-a;p.rfa=-a;p.y+=2*Math.sin(TAU*t);return p;},
 stepTouch:t=>{const p=baseFront(),s=Math.sin(TAU*t),q=Math.abs(s);p.x+=34*s;p.y+=8*q;p.lth=94+32*clamp(-s);p.rth=86-32*clamp(s);p.lua=140-80*q;p.rua=40+80*q;p.lfa=p.lua;p.rfa=p.rua;return p;},
 lowJack:t=>{const p=baseFront(),q=ease(pulse(t));p.lth=lerp(94,118,q);p.rth=lerp(86,62,q);p.lua=lerp(101,-132,q);p.lfa=p.lua;p.rua=lerp(79,-48,q);p.rfa=p.rua;p.y-=8*q;return p;},
 hipCircles:t=>{const p=baseFront();p.x+=15*Math.cos(TAU*t);p.y+=9*Math.sin(TAU*t);p.lua=38;p.lfa=132;p.rua=142;p.rfa=48;p.head=-4*Math.sin(TAU*t);return p;},
 torsoTwist:t=>{const p=baseFront(),s=wave(t);p.sw=94-30*Math.abs(s);p.hw=58-10*Math.abs(s);p.lua=30+58*s;p.lfa=8+35*s;p.rua=150+58*s;p.rfa=172+35*s;p.head=8*s;p.curve=10*s;return p;},
 ankleRolls:t=>{const p=baseFront(),a=TAU*t;p.lth=-92;p.lsh=88;p.lfoot=180+25*Math.sin(a);p.lua=38;p.lfa=132;p.rua=142;p.rfa=48;return p;},
 squat:t=>bendStanding(t,1),
 sumoSquat:t=>{const p=bendStanding(t,.9),q=ease(pulse(t));p.lth=lerp(112,152,q);p.lsh=lerp(78,48,q);p.rth=lerp(68,28,q);p.rsh=lerp(102,132,q);p.hw=74;return p;},
 squatPulse:t=>{const p=bendStanding(.5,.9),s=(1+Math.sin(TAU*t))/2;p.y+=12*s;p.lth+=6*s;p.rth-=6*s;return p;},
 squatReach:t=>{const p=bendStanding(t,1),q=ease(pulse(t));p.lua=lerp(-125,145,q);p.lfa=p.lua;p.rua=lerp(-55,35,q);p.rfa=p.rua;return p;},
 calfRaise:t=>{const p=baseFront(),q=ease(pulse(t));p.y-=24*q;p.lfoot=lerp(180,205,q);p.rfoot=lerp(0,-25,q);p.lua=38;p.lfa=132;p.rua=142;p.rfa=48;return p;},
 sideLunge:t=>{const p=baseFront(),q=ease(pulse(t));p.x+=52*q;p.y+=44*q;p.lth=lerp(112,78,q);p.lsh=lerp(78,85,q);p.rth=lerp(68,28,q);p.rsh=lerp(102,138,q);p.lua=lerp(101,145,q);p.rua=lerp(79,35,q);return p;},
 curtsyLunge:t=>{const p=baseFront(),q=ease(pulse(t));p.y+=58*q;p.lth=lerp(94,52,q);p.lsh=lerp(90,116,q);p.rth=lerp(86,128,q);p.rsh=lerp(90,64,q);p.x-=16*q;return p;},
 reverseLunge:t=>{const p=baseSide(),q=ease(pulse(t));p.x=330;p.y=lerp(330,382,q);p.torso=lerp(180,188,q);p.lth=lerp(18,42,q);p.lsh=lerp(14,126,q);p.rth=lerp(22,138,q);p.rsh=lerp(18,54,q);p.lua=lerp(92,70,q);p.lfa=lerp(88,40,q);p.rua=lerp(92,108,q);p.rfa=lerp(88,140,q);return p;},
 reverseLungeKnee:t=>{const q=t<.58?t/.58:(t-.58)/.42;return t<.58?POSES.reverseLunge(q*.5):(()=>{const p=baseFront(),u=ease(Math.sin(Math.PI*q));p.lth=94-190*u;p.rth=86;p.lua=101-110*u;p.rua=79+110*u;p.y-=8*u;return p;})();},
 wallSit:t=>{const p=baseSide(),s=Math.sin(TAU*t);p.x=350;p.y=404+3*s;p.torso=-94;p.lth=44;p.lsh=132;p.rth=48;p.rsh=128;p.lua=92;p.lfa=88;p.rua=92;p.rfa=88;p.head=2*s;return p;},
 goodMorning:t=>{const p=baseSide(),q=ease(pulse(t));p.x=330;p.y=330;p.torso=lerp(-90,174,q);p.lth=88;p.lsh=90;p.rth=92;p.rsh=90;p.lua=lerp(92,178,q);p.lfa=p.lua;p.rua=p.lua;p.rfa=p.lua;return p;},
 bentRow:t=>{const p=POSES.goodMorning(.5),q=ease(pulse(t));p.lua=lerp(88,152,q);p.lfa=lerp(88,42,q);p.rua=lerp(92,208,q);p.rfa=lerp(92,318,q);return p;},
 reverseFly:t=>{const p=POSES.goodMorning(.5),q=ease(pulse(t));p.lua=lerp(88,205,q);p.lfa=p.lua;p.rua=lerp(92,335,q);p.rfa=p.rua;return p;},
 gluteBridge:t=>{const p=baseSide(),q=ease(pulse(t));p.x=lerp(345,352,q);p.y=lerp(430,350,q);p.torso=180;p.lth=58;p.lsh=128;p.rth=62;p.rsh=124;p.lua=92;p.lfa=88;p.rua=94;p.rfa=86;return p;},
 singleLegBridge:t=>{const p=POSES.gluteBridge(t),q=ease(pulse(t));p.rth=lerp(62,330,q);p.rsh=lerp(124,330,q);return p;},
 floorPress:t=>{const p=baseSide(),q=ease(pulse(t));p.x=348;p.y=430;p.torso=180;p.lth=58;p.lsh=128;p.rth=62;p.rsh=124;p.lua=lerp(-90,88,q);p.lfa=lerp(-90,88,q);p.rua=lerp(-90,92,q);p.rfa=lerp(-90,92,q);return p;},
 crunch:t=>{const p=baseSide(),q=ease(pulse(t));p.x=350;p.y=430;p.torso=lerp(180,205,q);p.lth=58;p.lsh=128;p.rth=62;p.rsh=124;p.lua=35;p.lfa=145;p.rua=145;p.rfa=35;p.head=-12*q;return p;},
 deadBug:t=>{const p=baseFront(),s=Math.sin(TAU*t),l=clamp(s),r=clamp(-s);p.x=300;p.y=402;p.torso=-90;p.lth=-105+200*r;p.lsh=90;p.rth=-75+160*l;p.rsh=90;p.lua=-115+150*l;p.lfa=p.lua;p.rua=-65-150*r;p.rfa=p.rua;return p;},
 heelTap:t=>{const p=baseSide(),s=wave(t);p.x=350;p.y=430;p.torso=180+12*Math.abs(s);p.lth=58;p.lsh=128;p.rth=62;p.rsh=124;p.lua=lerp(92,58,clamp(s));p.rua=lerp(92,122,clamp(-s));p.lfa=p.lua;p.rfa=p.rua;return p;},
 bicycle:t=>{const p=baseSide(),s=Math.sin(TAU*t),l=clamp(s),r=clamp(-s);p.x=350;p.y=416;p.torso=196;p.lth=lerp(18,145,l);p.lsh=lerp(18,62,l);p.rth=lerp(18,145,r);p.rsh=lerp(18,62,r);p.lua=lerp(30,155,l);p.lfa=lerp(150,40,l);p.rua=lerp(150,25,r);p.rfa=lerp(30,140,r);return p;},
 plank:t=>{const p=baseSide(),s=Math.sin(TAU*t);p.x=360;p.y=348+2*s;p.torso=180;p.lth=8;p.lsh=8;p.rth=12;p.rsh=12;p.lua=88;p.lfa=88;p.rua=92;p.rfa=92;p.head=3*s;return p;},
 pushup:t=>{const p=POSES.plank(t),q=ease(pulse(t));p.y+=44*q;p.lua=lerp(88,142,q);p.lfa=lerp(88,48,q);p.rua=lerp(92,38,q);p.rfa=lerp(92,132,q);p.head=-7*q;return p;},
 inclinePushup:t=>{const p=POSES.pushup(t);p.x=350;p.y-=82;p.lth=18;p.lsh=18;p.rth=22;p.rsh=22;return p;},
 shoulderTap:t=>{const p=POSES.plank(t),s=Math.sin(TAU*t),l=clamp(s),r=clamp(-s);p.lua=lerp(88,205,l);p.lfa=lerp(88,325,l);p.rua=lerp(92,335,r);p.rfa=lerp(92,215,r);p.y+=4*Math.abs(s);return p;},
 mountainClimber:t=>{const p=POSES.plank(t),s=Math.sin(TAU*t),l=clamp(s),r=clamp(-s);p.lth=lerp(8,150,l);p.lsh=lerp(8,62,l);p.rth=lerp(12,150,r);p.rsh=lerp(12,62,r);p.x-=8*Math.abs(s);return p;},
 sidePlank:t=>{const p=baseSide(),s=Math.sin(TAU*t);p.x=360;p.y=352+3*s;p.torso=180;p.lth=10;p.lsh=10;p.rth=14;p.rsh=14;p.lua=90;p.lfa=90;p.rua=-90;p.rfa=-90;p.head=2*s;return p;},
 pikePress:t=>{const p=POSES.downwardDog(t),q=ease(pulse(t));p.lua=lerp(122,155,q);p.lfa=lerp(122,72,q);p.rua=lerp(118,25,q);p.rfa=lerp(118,108,q);p.y+=18*q;return p;},
 tricepsDip:t=>{const p=baseSide(),q=ease(pulse(t));p.x=340;p.y=lerp(330,386,q);p.torso=-90;p.lth=35;p.lsh=128;p.rth=40;p.rsh=124;p.lua=lerp(86,132,q);p.lfa=lerp(86,38,q);p.rua=lerp(94,48,q);p.rfa=lerp(94,142,q);return p;},
 superman:t=>{const p=baseSide(),q=ease(pulse(t));p.x=350;p.y=432-35*q;p.torso=180-8*q;p.lth=lerp(8,-8,q);p.lsh=p.lth;p.rth=lerp(12,-4,q);p.rsh=p.rth;p.lua=lerp(180,194,q);p.lfa=p.lua;p.rua=lerp(180,186,q);p.rfa=p.rua;return p;},
 birdDog:t=>{const p=baseSide(),s=Math.sin(TAU*t),l=clamp(s),r=clamp(-s);p.x=350;p.y=330;p.torso=180;p.lua=lerp(90,180,l);p.lfa=p.lua;p.rua=lerp(90,180,r);p.rfa=p.rua;p.lth=lerp(70,0,r);p.lsh=lerp(110,0,r);p.rth=lerp(70,0,l);p.rsh=lerp(110,0,l);return p;},
 donkeyKick:t=>{const p=baseSide(),q=ease(pulse(t));p.x=350;p.y=330;p.torso=180;p.lua=90;p.lfa=90;p.rua=90;p.rfa=90;p.lth=70;p.lsh=110;p.rth=lerp(70,-65,q);p.rsh=lerp(110,-5,q);return p;},
 fireHydrant:t=>{const p=baseFront(),q=ease(pulse(t));p.x=300;p.y=320;p.torso=-90;p.lua=105;p.lfa=90;p.rua=75;p.rfa=90;p.lth=lerp(90,165,q);p.lsh=lerp(90,180,q);p.rth=90;p.rsh=90;return p;},
 catCow:t=>{const p=baseSide(),s=Math.sin(TAU*t);p.x=350;p.y=330+12*s;p.torso=180+10*s;p.curve=18*s;p.lua=90;p.lfa=90;p.rua=90;p.rfa=90;p.lth=70;p.lsh=110;p.rth=74;p.rsh=106;p.head=-15*s;return p;},
 childPose:t=>{const p=baseSide(),s=Math.sin(TAU*t);p.x=360;p.y=410+3*s;p.torso=205;p.lth=55;p.lsh=145;p.rth=60;p.rsh=140;p.lua=175;p.lfa=175;p.rua=185;p.rfa=185;p.head=8;return p;},
 cobra:t=>{const p=baseSide(),q=ease(pulse(t));p.x=350;p.y=430;p.torso=lerp(180,235,q);p.lth=8;p.lsh=8;p.rth=12;p.rsh=12;p.lua=lerp(90,112,q);p.lfa=lerp(90,70,q);p.rua=lerp(90,68,q);p.rfa=lerp(90,110,q);p.head=-10*q;return p;},
 downwardDog:t=>{const p=baseSide(),s=Math.sin(TAU*t);p.x=360;p.y=245+3*s;p.torso=150;p.lth=48;p.lsh=48;p.rth=44;p.rsh=44;p.lua=120;p.lfa=120;p.rua=124;p.rfa=124;p.head=4*s;return p;},
 hamstringStretch:t=>{const p=baseSide(),q=ease(pulse(t));p.x=332;p.y=330;p.torso=lerp(-90,178,q);p.lth=68;p.lsh=78;p.rth=98;p.rsh=92;p.lua=lerp(92,168,q);p.lfa=p.lua;p.rua=p.lua;p.rfa=p.lua;return p;},
 hipFlexorStretch:t=>{const p=baseSide(),s=Math.sin(TAU*t);p.x=330;p.y=382+4*s;p.torso=-92;p.lth=40;p.lsh=132;p.rth=132;p.rsh=92;p.lua=-115;p.lfa=-115;p.rua=-65;p.rfa=-65;return p;},
 chestOpener:t=>{const p=baseFront(),q=ease(pulse(t));p.lua=lerp(100,210,q);p.lfa=lerp(95,198,q);p.rua=lerp(80,330,q);p.rfa=lerp(85,342,q);p.sw=94+16*q;p.head=-4*q;return p;},
 figure4:t=>{const p=baseSide(),s=Math.sin(TAU*t);p.x=350;p.y=430+2*s;p.torso=180;p.lth=58;p.lsh=128;p.rth=lerp(62,190,.85);p.rsh=lerp(124,20,.85);p.lua=45;p.lfa=130;p.rua=135;p.rfa=50;return p;},
 thoracicRotation:t=>{const p=baseSide(),q=ease(pulse(t));p.x=350;p.y=340;p.torso=180;p.lua=90;p.lfa=90;p.rua=lerp(90,-72,q);p.rfa=p.rua;p.lth=70;p.lsh=110;p.rth=74;p.rsh=106;p.head=-10*q;return p;},
 breathing:t=>{const p=baseFront(),s=Math.sin(TAU*t);p.scale=1+.012*s;p.y-=2*s;p.lua=44;p.lfa=136;p.rua=136;p.rfa=44;p.head=2*s;return p;},
 burpeeStepback:t=>{const u=(t%1)*4;if(u<1)return bendStanding(u/2,1);if(u<2){const q=ease(u-1),p=POSES.plank(0);p.y=lerp(420,350,q);p.x=lerp(330,360,q);return p;}if(u<3)return POSES.plank((u-2)*.2);const q=ease(u-3),p=POSES.plank(0);p.x=lerp(360,300,q);p.y=lerp(350,326,q);p.torso=lerp(180,-90,q);p.lth=lerp(8,94,q);p.lsh=lerp(8,90,q);p.rth=lerp(12,86,q);p.rsh=lerp(12,90,q);p.lua=lerp(88,-125,q);p.lfa=p.lua;p.rua=lerp(92,-55,q);p.rfa=p.rua;return p;},
 skater:t=>{const p=baseFront(),s=Math.sin(TAU*t),q=Math.abs(s);p.x+=58*s;p.y+=22*q;p.torso=-90+10*s;p.lth=94+55*clamp(-s);p.lsh=90-30*clamp(-s);p.rth=86-55*clamp(s);p.rsh=90+30*clamp(s);p.lua=150-90*clamp(s);p.rua=30+90*clamp(-s);return p;}
};

function poseFor(id,t){return(POSES[id]||POSES.breathing)(t);}

function joints(p){
 const sc=p.scale||1,torsoLen=172*sc,upperArm=91*sc,foreArm=83*sc,thigh=125*sc,shin=115*sc,foot=34*sc;
 const hip={x:p.x,y:p.y};const tc=add(hip,vec(p.torso,torsoLen));const perp=vec(p.torso+90,1);const wf=p.view==='side'?.26:1;
 const sw=(p.sw||94)*wf*sc,hw=(p.hw||58)*wf*sc;
 const ls={x:tc.x-perp.x*sw/2,y:tc.y-perp.y*sw/2},rs={x:tc.x+perp.x*sw/2,y:tc.y+perp.y*sw/2};
 const lh={x:hip.x-perp.x*hw/2,y:hip.y-perp.y*hw/2},rh={x:hip.x+perp.x*hw/2,y:hip.y+perp.y*hw/2};
 const le=add(ls,vec(p.lua,upperArm)),lw=add(le,vec(p.lfa,foreArm));const re=add(rs,vec(p.rua,upperArm)),rw=add(re,vec(p.rfa,foreArm));
 const lk=add(lh,vec(p.lth,thigh)),la=add(lk,vec(p.lsh,shin)),lf=add(la,vec(p.lfoot,foot));const rk=add(rh,vec(p.rth,thigh)),ra=add(rk,vec(p.rsh,shin)),rf=add(ra,vec(p.rfoot,foot));
 const neck=add(tc,vec(p.torso,24*sc)),head=add(neck,vec(p.torso+(p.head||0),31*sc));
 return{hip,tc,ls,rs,lh,rh,le,lw,re,rw,lk,la,lf,rk,ra,rf,neck,head,sc,p};
}

function canonicalTargets(id){const list=TARGETS[id]||['Core'];const s=list.join(' ').toLowerCase(),out=new Set();
 if(/full body/.test(s))['chest','shoulders','arms','core','back','glutes','quads','hamstrings','calves'].forEach(x=>out.add(x));
 if(/chest/.test(s))out.add('chest');if(/shoulder/.test(s))out.add('shoulders');if(/tricep|bicep|arm/.test(s))out.add('arms');if(/core|oblique|diaphragm/.test(s))out.add('core');if(/back|spine/.test(s))out.add('back');if(/glute/.test(s))out.add('glutes');if(/quad|thigh|leg/.test(s))out.add('quads');if(/hamstring/.test(s))out.add('hamstrings');if(/calf|ankle/.test(s))out.add('calves');if(/hip flexor|hip/.test(s))out.add('hips');return out;}

function line(ctx,a,b,width,color,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();}
function capsule(ctx,a,b,w,front=true){
 ctx.save();const g=ctx.createLinearGradient(a.x,a.y,b.x,b.y);g.addColorStop(0,front?'#eeeae7':'#c8cccd');g.addColorStop(.48,front?'#d7d1ce':'#adb4b6');g.addColorStop(1,front?'#f2efed':'#c9cecf');line(ctx,a,b,w,g,front?1:.72);line(ctx,a,b,Math.max(2,w*.08),'rgba(79,89,91,.48)',front?1:.6);
 const len=dist(a,b),ang=Math.atan2(b.y-a.y,b.x-a.x);ctx.translate(a.x,a.y);ctx.rotate(ang);ctx.strokeStyle='rgba(120,75,64,.22)';ctx.lineWidth=1;for(let i=10;i<len-8;i+=13){ctx.beginPath();ctx.moveTo(i,-w*.28);ctx.lineTo(i+7,w*.28);ctx.stroke();}ctx.restore();
}
function glowLine(ctx,a,b,w){ctx.save();ctx.shadowColor='rgba(239,55,49,.9)';ctx.shadowBlur=16;line(ctx,a,b,w,'rgba(229,47,42,.86)');line(ctx,a,b,w*.45,'rgba(255,112,91,.88)');ctx.restore();}
function glowEllipse(ctx,x,y,rx,ry,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.shadowColor='rgba(239,55,49,.92)';ctx.shadowBlur=18;const g=ctx.createRadialGradient(0,0,2,0,0,Math.max(rx,ry));g.addColorStop(0,'rgba(255,117,96,.92)');g.addColorStop(.55,'rgba(228,48,43,.84)');g.addColorStop(1,'rgba(163,24,27,.58)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,TAU);ctx.fill();ctx.restore();}
function drawProp(ctx,id){ctx.save();ctx.strokeStyle='rgba(80,88,89,.38)';ctx.fillStyle='rgba(137,145,146,.16)';ctx.lineWidth=5;
 if(id==='wallSit'){ctx.beginPath();ctx.moveTo(435,95);ctx.lineTo(435,585);ctx.stroke();}
 if(id==='inclinePushup'){ctx.fillRect(95,335,130,18);ctx.fillRect(105,353,12,160);ctx.fillRect(205,353,12,160);}
 if(id==='tricepsDip'){ctx.fillRect(112,315,160,18);ctx.fillRect(124,333,12,175);ctx.fillRect(248,333,12,175);}
 ctx.restore();}
function drawFigure(ctx,id,p){const j=joints(p),targets=canonicalTargets(id),side=p.view==='side';
 drawProp(ctx,id);
 const ground=Math.max(j.la.y,j.ra.y,j.lf.y,j.rf.y,540);ctx.save();ctx.fillStyle='rgba(48,54,55,.12)';ctx.filter='blur(7px)';ctx.beginPath();ctx.ellipse(300,Math.min(592,ground+10),110,13,0,0,TAU);ctx.fill();ctx.restore();
 const backAlpha=side?.56:.78;
 capsule(ctx,j.rs,j.re,23*j.sc,false);capsule(ctx,j.re,j.rw,17*j.sc,false);capsule(ctx,j.rh,j.rk,31*j.sc,false);capsule(ctx,j.rk,j.ra,22*j.sc,false);line(ctx,j.ra,j.rf,13*j.sc,'#c6cbcc',backAlpha);
 ctx.save();const torsoGrad=ctx.createLinearGradient(j.tc.x,j.tc.y,j.hip.x,j.hip.y);torsoGrad.addColorStop(0,'#efebe8');torsoGrad.addColorStop(.5,'#c8c2bf');torsoGrad.addColorStop(1,'#ddd7d4');ctx.fillStyle=torsoGrad;ctx.strokeStyle='rgba(78,85,87,.62)';ctx.lineWidth=2.2;
 ctx.beginPath();ctx.moveTo(j.ls.x,j.ls.y);ctx.quadraticCurveTo(j.tc.x+(j.rs.x-j.ls.x)*.12,j.tc.y+38,j.rs.x,j.rs.y);ctx.lineTo(j.rh.x,j.rh.y);ctx.quadraticCurveTo(j.hip.x,j.hip.y+24,j.lh.x,j.lh.y);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
 const chest=avg(j.ls,j.rs),pel=avg(j.lh,j.rh),torsoAngle=deg(p.torso);
 if(targets.has('back'))glowEllipse(ctx,lerp(chest.x,pel.x,.48),lerp(chest.y,pel.y,.48),side?19:48,54,torsoAngle+Math.PI/2);
 if(targets.has('chest')){glowEllipse(ctx,lerp(j.ls.x,j.rs.x,.42),lerp(j.ls.y,j.lh.y,.27),side?12:27,22,torsoAngle+Math.PI/2);glowEllipse(ctx,lerp(j.ls.x,j.rs.x,.58),lerp(j.rs.y,j.rh.y,.27),side?12:27,22,torsoAngle+Math.PI/2);}
 if(targets.has('core'))glowEllipse(ctx,lerp(chest.x,pel.x,.68),lerp(chest.y,pel.y,.68),side?13:28,42,torsoAngle+Math.PI/2);
 if(targets.has('hips'))glowEllipse(ctx,pel.x,pel.y,side?14:35,22,torsoAngle+Math.PI/2);
 if(targets.has('glutes')){glowEllipse(ctx,j.lh.x,j.lh.y+6,side?13:23,22,torsoAngle+Math.PI/2);glowEllipse(ctx,j.rh.x,j.rh.y+6,side?13:23,22,torsoAngle+Math.PI/2);}
 capsule(ctx,j.ls,j.le,24*j.sc,true);capsule(ctx,j.le,j.lw,17*j.sc,true);capsule(ctx,j.lh,j.lk,32*j.sc,true);capsule(ctx,j.lk,j.la,22*j.sc,true);line(ctx,j.la,j.lf,13*j.sc,'#e0ddda');
 if(targets.has('shoulders')){glowEllipse(ctx,j.ls.x,j.ls.y,side?12:17,16);glowEllipse(ctx,j.rs.x,j.rs.y,side?12:17,16);}if(targets.has('arms')){glowLine(ctx,j.ls,j.le,15*j.sc);glowLine(ctx,j.le,j.lw,11*j.sc);glowLine(ctx,j.rs,j.re,15*j.sc);glowLine(ctx,j.re,j.rw,11*j.sc);}if(targets.has('quads')){glowLine(ctx,j.lh,j.lk,21*j.sc);glowLine(ctx,j.rh,j.rk,21*j.sc);}if(targets.has('hamstrings')){glowLine(ctx,j.lh,j.lk,15*j.sc);glowLine(ctx,j.rh,j.rk,15*j.sc);}if(targets.has('calves')){glowLine(ctx,j.lk,j.la,14*j.sc);glowLine(ctx,j.rk,j.ra,14*j.sc);}
 line(ctx,j.tc,j.hip,2,'rgba(86,94,96,.55)');line(ctx,j.ls,j.rs,1.4,'rgba(96,69,62,.35)');line(ctx,j.lh,j.rh,1.2,'rgba(96,69,62,.32)');
 for(let k=.22;k<.9;k+=.18){const c={x:lerp(chest.x,pel.x,k),y:lerp(chest.y,pel.y,k)};const half=(side?7:26)*(1-k*.25);line(ctx,{x:c.x-half,y:c.y},{x:c.x+half,y:c.y},1,'rgba(105,76,67,.28)');}
 [j.ls,j.rs,j.le,j.re,j.lw,j.rw,j.lh,j.rh,j.lk,j.rk,j.la,j.ra].forEach(pt=>{ctx.fillStyle='rgba(238,240,240,.95)';ctx.strokeStyle='rgba(78,87,89,.58)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(pt.x,pt.y,4.2*j.sc,0,TAU);ctx.fill();ctx.stroke();});
 line(ctx,j.tc,j.neck,16*j.sc,'#d8d5d2');ctx.save();ctx.translate(j.head.x,j.head.y);ctx.rotate(deg((p.head||0)+p.torso+90));ctx.fillStyle='#e8e5e2';ctx.strokeStyle='rgba(72,80,82,.67)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,24*j.sc,30*j.sc,0,0,TAU);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(94,68,62,.36)';ctx.beginPath();ctx.moveTo(-14*j.sc,-3*j.sc);ctx.lineTo(14*j.sc,-3*j.sc);ctx.moveTo(0,-22*j.sc);ctx.lineTo(0,23*j.sc);ctx.stroke();ctx.fillStyle='rgba(55,63,64,.58)';ctx.beginPath();ctx.arc(-8*j.sc,-6*j.sc,2.2*j.sc,0,TAU);ctx.arc(8*j.sc,-6*j.sc,2.2*j.sc,0,TAU);ctx.fill();ctx.restore();
}

class MotionController{
 constructor(stage,id,opts={}){this.stage=stage;this.id=id;this.opts=opts;this.canvas=stage.querySelector('canvas');this.ctx=this.canvas.getContext('2d');this.start=performance.now();this.offset=0;this.playing=opts.autoplay!==false;this.dead=false;this.raf=0;this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(stage);this.resize();this.tick=this.tick.bind(this);this.tick(performance.now());}
 resize(){const r=this.stage.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);this.cssW=Math.max(1,r.width);this.cssH=Math.max(1,r.height);this.canvas.width=Math.round(this.cssW*dpr);this.canvas.height=Math.round(this.cssH*dpr);this.canvas.style.width=this.cssW+'px';this.canvas.style.height=this.cssH+'px';this.dpr=dpr;}
 tick(now){if(this.dead)return;if(this.playing)this.draw(now);this.raf=requestAnimationFrame(this.tick);}
 draw(now){const ctx=this.ctx,w=this.cssW,h=this.cssH,dpr=this.dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const s=Math.min(w/600,h/620),ox=(w-600*s)/2,oy=(h-620*s)/2;ctx.save();ctx.translate(ox,oy);ctx.scale(s,s);const duration=(SPEED[this.id]||2.5)*1000;const t=((now-this.start+this.offset)%duration)/duration;const pose=poseFor(this.id,t);const figureScale=pose.view==='side'?.74:.70;ctx.translate(300,322);ctx.scale(figureScale,figureScale);ctx.translate(-300,-322);drawFigure(ctx,this.id,pose);ctx.restore();}
 pause(){if(!this.playing)return;this.offset+=(performance.now()-this.start);this.playing=false;this.stage.classList.add('is-paused');this.draw(this.start);}
 play(){if(this.playing)return;this.start=performance.now();this.playing=true;this.stage.classList.remove('is-paused');}
 toggle(){this.playing?this.pause():this.play();return this.playing;}
 destroy(){this.dead=true;cancelAnimationFrame(this.raf);this.resizeObserver?.disconnect();}
}

function mount(container,id,opts={}){
 try{container.__anatomyMotion?.destroy?.();}catch{}
 const title=opts.name||id;const targets=TARGETS[id]||opts.muscles||['Core'];container.innerHTML=`<div class="anatomy-motion-stage"><canvas class="anatomy-motion-canvas" role="img" aria-label="Full-body anatomical animation of ${String(title).replace(/"/g,'&quot;')}"></canvas><div class="anatomy-motion-title">${title}</div><div class="anatomy-motion-mode">Full-body anatomy</div><div class="anatomy-motion-targets">${targets.join(' · ')}</div></div>`;
 const stage=container.querySelector('.anatomy-motion-stage');const controller=new MotionController(stage,id,{autoplay:opts.autoplay!==false});container.__anatomyMotion=controller;return controller;
}
window.AnatomyMotion={mount,targets:id=>[...(TARGETS[id]||[])],has:id=>Boolean(POSES[id]),version:'5.0.0'};
})();
