(() => {
  'use strict';

  const PREF_KEY = 'fitnessV4Preferences';
  const OLD_PREF_KEY = 'fitnessV3Preferences';
  const DEFAULT_PREFS = {
    language: 'en',
    voiceGuide: 'full',
    voiceGender: 'auto',
    voiceRate: '0.92',
    subtitles: 'on',
    countdownVoice: 'on',
    formCues: 'on',
    lowData: 'off'
  };

  const EXERCISE_HI = {
    'March in Place': ['जगह पर मार्च', 'सीधे खड़े रहें। एक घुटना उठाते समय विपरीत हाथ को आगे लाएँ। पैर को धीरे रखें और सांस सामान्य रखें।'],
    'Arm Circles': ['बाँहों के गोल चक्र', 'बाँहों को कंधों की ऊँचाई पर फैलाएँ। छोटे नियंत्रित गोले बनाकर धीरे-धीरे बड़े करें और आधे समय बाद दिशा बदलें।'],
    'Step Touch': ['साइड स्टेप टच', 'एक पैर को बगल में रखें और दूसरे पैर को हल्के से पास लाएँ। दोनों ओर बारी-बारी जाएँ और घुटनों को नरम रखें।'],
    'Hip Circles': ['कूल्हों के गोल चक्र', 'पैर आरामदायक दूरी पर रखें। कूल्हों को धीरे गोल घुमाएँ, छाती ऊपर रखें और फिर दिशा बदलें।'],
    'Standing Torso Twist': ['खड़े होकर धड़ मोड़ना', 'घुटनों को हल्का मोड़कर खड़े रहें। पसलियों और कंधों को धीरे दाएँ-बाएँ घुमाएँ, लेकिन घुटनों को न मरोड़ें।'],
    'Heel Digs': ['हील डिग्स', 'एक एड़ी आगे रखें और पंजा ऊपर रखें। कूल्हों को थोड़ा पीछे ले जाएँ और दोनों पैरों से बारी-बारी करें।'],
    'Alternating Knee Hug': ['बारी-बारी घुटना गले लगाना', 'एक घुटना ऊपर उठाएँ और हाथों से धीरे छाती की ओर खींचें। पीठ सीधी रखें और फिर पैर बदलें।'],
    'Ankle Rolls': ['टखने घुमाना', 'ज़रूरत हो तो सहारा पकड़ें। एक पैर हल्का उठाकर टखने को दोनों दिशाओं में धीरे घुमाएँ।'],
    'Bodyweight Squat': ['बॉडीवेट स्क्वाट', 'पैर कंधों की चौड़ाई पर रखें। कूल्हे पीछे और नीचे ले जाएँ, घुटने पंजों की दिशा में रखें और पूरी एड़ी से दबाकर खड़े हों।'],
    'Sumo Squat': ['सूमो स्क्वाट', 'पैर चौड़े रखें और पंजे थोड़ा बाहर करें। छाती ऊपर रखते हुए नीचे बैठें और खड़े होते समय कूल्हों को कसें।'],
    'Squat Pulse': ['स्क्वाट पल्स', 'आरामदायक स्क्वाट में नीचे रहें। कुछ सेंटीमीटर ऊपर-नीचे नियंत्रित गति करें और एड़ियों को जमीन पर रखें।'],
    'Reverse Lunge': ['रिवर्स लंज', 'एक पैर पीछे रखें और दोनों घुटने मोड़ें। सामने वाला पैर पूरा जमीन पर रखें और उसी पैर से दबाकर वापस आएँ।'],
    'Side Lunge': ['साइड लंज', 'एक ओर लंबा कदम रखें। उसी तरफ के कूल्हे पीछे बैठाएँ, दूसरा पैर लंबा रखें और एड़ी से दबाकर बीच में लौटें।'],
    'Curtsy Step-Back': ['कर्टसी स्टेप-बैक', 'एक पैर को तिरछा पीछे रखें। सामने के घुटने को पंजों की दिशा में रखें और कूल्हों को नियंत्रित रखते हुए वापस आएँ।'],
    'Glute Bridge': ['ग्लूट ब्रिज', 'पीठ के बल लेटें, घुटने मोड़ें और पैर जमीन पर रखें। एड़ियों से दबाकर कूल्हे उठाएँ, कूल्हों को कसें और धीरे नीचे आएँ।'],
    'Alternating Bridge March': ['ब्रिज मार्च', 'कूल्हे ऊपर रखकर ब्रिज बनाएँ। पेट को कसकर एक पैर हल्का उठाएँ, नीचे रखें और फिर दूसरा पैर उठाएँ।'],
    'Calf Raise': ['काफ रेज़', 'सीधे खड़े होकर एड़ियाँ धीरे ऊपर उठाएँ। पंजों पर संतुलन रखें और नियंत्रण से नीचे आएँ।'],
    'Wall Sit': ['वॉल सिट', 'पीठ दीवार से लगाएँ और नीचे सरकें। घुटने आरामदायक कोण पर रखें, पेट कसें और समान सांस लेते रहें।'],
    'Hip Hinge / Good Morning': ['हिप हिंग', 'घुटनों को थोड़ा मोड़ें। पीठ सीधी रखते हुए कूल्हे पीछे धकेलें, फिर कूल्हों को आगे लाकर खड़े हों।'],
    'Donkey Kick': ['डंकी किक', 'हाथ और घुटनों पर आएँ। पेट कसकर एक मुड़ा हुआ पैर पीछे और ऊपर उठाएँ, कमर को न मोड़ें और धीरे नीचे रखें।'],
    'Fire Hydrant': ['फायर हाइड्रेंट', 'हाथ और घुटनों पर स्थिर रहें। एक मुड़ा हुआ घुटना बगल में उठाएँ, कूल्हे सीधे रखें और धीरे नीचे लाएँ।'],
    'Incline Push-Up': ['इन्क्लाइन पुश-अप', 'हाथ दीवार या मजबूत बेंच पर रखें। शरीर सिर से एड़ी तक सीधा रखें, छाती को सहारे की ओर लाएँ और वापस धकेलें।'],
    'Push-Up': ['पुश-अप', 'हाथ कंधों से थोड़ा चौड़े रखें। शरीर सीधा रखते हुए कोहनियाँ मोड़ें, छाती नीचे लाएँ और जमीन को धकेलकर ऊपर आएँ।'],
    'Pike Shoulder Press': ['पाइक शोल्डर प्रेस', 'कूल्हे ऊपर उठाकर उल्टा वी बनाएँ। सिर को हाथों के बीच नीचे लाएँ और कंधों से दबाकर वापस ऊपर जाएँ।'],
    'Plank Shoulder Tap': ['प्लैंक शोल्डर टैप', 'ऊँचे प्लैंक में शरीर सीधा रखें। कूल्हे स्थिर रखते हुए एक हाथ से विपरीत कंधे को छुएँ और हाथ बदलें।'],
    'Chair Triceps Dip': ['चेयर ट्राइसेप्स डिप', 'मजबूत कुर्सी के किनारे हाथ रखें। कूल्हे पास रखते हुए कोहनियाँ पीछे मोड़ें और हथेलियों से दबाकर ऊपर आएँ।'],
    'Bent-Over Row': ['बेंट-ओवर रो', 'कूल्हों से आगे झुकें और पीठ सीधी रखें। कोहनियों को पीछे खींचकर हाथ पसलियों की ओर लाएँ और धीरे नीचे करें।'],
    'Bent-Over Reverse Fly': ['बेंट-ओवर रिवर्स फ्लाई', 'पीठ सीधी रखते हुए आगे झुकें। हल्की मुड़ी बाँहों को बगल में खोलें, कंधे पीछे लें और धीरे वापस लाएँ।'],
    'Floor Chest Press': ['फ्लोर चेस्ट प्रेस', 'पीठ के बल लेटें और कोहनियाँ जमीन पर रखें। हाथों को ऊपर दबाएँ, छाती और ट्राइसेप्स कसें और नियंत्रण से नीचे आएँ।'],
    'Prone Back Extension': ['प्रोन बैक एक्सटेंशन', 'पेट के बल लेटें। गर्दन सीधी रखते हुए छाती और हाथ हल्के उठाएँ, कमर को जोर से न मोड़ें और नीचे आएँ।'],
    'Forearm Plank': ['फोरआर्म प्लैंक', 'कोहनियाँ कंधों के नीचे रखें। सिर से एड़ी तक शरीर सीधा रखें, पेट और कूल्हे कसें और सांस न रोकें।'],
    'Side Plank': ['साइड प्लैंक', 'एक कोहनी कंधे के नीचे रखें। कूल्हे उठाकर सिर से पैर तक सीधी रेखा बनाएँ और नीचे वाले कंधे को न दबाएँ।'],
    'Dead Bug': ['डेड बग', 'पीठ के बल लेटकर हाथ ऊपर और घुटने मोड़ें। कमर को स्थिर रखते हुए विपरीत हाथ और पैर नीचे करें, फिर वापस आएँ।'],
    'Bird Dog': ['बर्ड डॉग', 'हाथ और घुटनों पर पेट कसें। विपरीत हाथ और पैर लंबा करें, कूल्हे सीधे रखें और नियंत्रण से वापस आएँ।'],
    'Heel Tap Crunch': ['हील टैप क्रंच', 'पीठ के बल घुटने मोड़कर लेटें। कंधे हल्के उठाएँ और बारी-बारी हाथ से एड़ी की ओर पहुँचें।'],
    'Slow Bicycle': ['धीमा बाइसिकल', 'पीठ के बल लेटकर पेट कसें। एक घुटना अंदर लाते समय विपरीत कंधा उसकी ओर घुमाएँ और धीरे पक्ष बदलें।'],
    'Controlled Crunch': ['कंट्रोल्ड क्रंच', 'घुटने मोड़कर लेटें। पेट कसकर कंधे हल्के उठाएँ, गर्दन को न खींचें और धीरे नीचे आएँ।'],
    'Low-Impact Jack': ['लो-इम्पैक्ट जैक', 'एक पैर बगल में रखते हुए दोनों हाथ ऊपर उठाएँ। बीच में लौटें और दूसरे पैर से दोहराएँ, बिना कूदे।'],
    'High-Knee March or Run': ['हाई-नी मार्च या रन', 'एक घुटना ऊँचा उठाएँ और विपरीत हाथ चलाएँ। शरीर सीधा रखें और अपनी क्षमता के अनुसार मार्च या दौड़ें।'],
    'Skater Step': ['स्केटर स्टेप', 'एक ओर कदम रखें और दूसरा पैर तिरछा पीछे ले जाएँ। कूल्हे पीछे रखें और नियंत्रित तरीके से दूसरी ओर जाएँ।'],
    'Mountain Climber': ['माउंटेन क्लाइंबर', 'ऊँचे प्लैंक में शरीर सीधा रखें। एक घुटना छाती की ओर लाएँ, वापस रखें और पैर बदलें।'],
    'Fast Feet': ['फास्ट फीट', 'घुटनों को हल्का मोड़कर छोटे तेज कदम लें। शरीर हल्का रखें और तकनीक बिगड़ने से पहले गति कम करें।'],
    'Squat to Reach': ['स्क्वाट टू रीच', 'स्क्वाट में नीचे जाएँ और खड़े होते समय दोनों हाथ ऊपर पहुँचाएँ। एड़ियाँ नीचे और घुटने पंजों की दिशा में रखें।'],
    'Reverse Lunge to Knee Drive': ['रिवर्स लंज से नी ड्राइव', 'एक पैर पीछे लेकर लंज करें। सामने वाले पैर से दबाकर ऊपर आएँ और पीछे वाले घुटने को सामने उठाएँ।'],
    'Step-Back Burpee': ['स्टेप-बैक बर्पी', 'नीचे झुककर हाथ जमीन या बेंच पर रखें। एक-एक पैर पीछे प्लैंक में ले जाएँ, फिर आगे लाकर नियंत्रित तरीके से खड़े हों।'],
    "Child's Pose": ['चाइल्ड पोज़', 'घुटनों पर बैठकर कूल्हे एड़ियों की ओर ले जाएँ। हाथ आगे फैलाएँ और पीठ तथा कंधों को आराम दें।'],
    'Cat–Cow': ['कैट-काउ', 'हाथ और घुटनों पर सांस लेते हुए छाती खोलें। सांस छोड़ते समय पीठ गोल करें और दोनों स्थितियों के बीच धीरे चलें।'],
    'Low Cobra': ['लो कोबरा', 'पेट के बल लेटें और हाथ छाती के पास रखें। पीठ की मांसपेशियों से छाती हल्की उठाएँ, कंधे नीचे रखें और वापस आएँ।'],
    'Hamstring Stretch': ['हैमस्ट्रिंग स्ट्रेच', 'एक पैर लंबा रखें और कूल्हों से हल्का आगे झुकें। पीठ सीधी रखें और दर्द तक न खींचें।'],
    'Half-Kneeling Hip Flexor Stretch': ['हाफ-नीलिंग हिप फ्लेक्सर स्ट्रेच', 'एक घुटना जमीन पर और दूसरा पैर आगे रखें। कूल्हे हल्के आगे ले जाएँ, पेट कसें और कमर न मोड़ें।'],
    'Chest Opener': ['चेस्ट ओपनर', 'हाथ पीछे जोड़ें या बाँहें खोलें। कंधे नीचे और पीछे रखें, छाती धीरे खोलें और गर्दन आराम में रखें।'],
    'Figure-Four Glute Stretch': ['फिगर-फोर ग्लूट स्ट्रेच', 'एक टखना दूसरे घुटने पर रखें। पैर को धीरे अपनी ओर खींचें और कूल्हे में आरामदायक खिंचाव महसूस करें।'],
    'Open-Book Rotation': ['ओपन-बुक रोटेशन', 'करवट लेकर घुटने मोड़ें। ऊपर वाली बाँह को सामने से खोलते हुए पीछे ले जाएँ और घुटनों को साथ रखें।'],
    'Slow Recovery Breathing': ['धीमी रिकवरी ब्रीदिंग', 'आराम से बैठें या लेटें। नाक से धीरे सांस लें और लंबी आरामदायक सांस छोड़ते हुए कंधे ढीले करें।'],
    'Downward Dog Pedal': ['डाउनवर्ड डॉग पेडल', 'हाथ और पैरों से उल्टा वी बनाएँ। रीढ़ लंबी रखें और एक-एक एड़ी को धीरे जमीन की ओर दबाएँ।']
  };

  const MEAL_HI = {
    'Oats cooked with milk, chia seeds, berries and a spoon of peanut butter.':'दूध में पके ओट्स, चिया बीज, बेरी और एक चम्मच पीनट बटर।',
    'Fruit with Greek yoghurt or a handful of nuts.':'फल के साथ ग्रीक योगर्ट या एक मुट्ठी मेवे।',
    'Dal, brown rice or two wholemeal rotis, mixed salad and lemon.':'दाल, ब्राउन राइस या दो साबुत आटे की रोटियाँ, मिश्रित सलाद और नींबू।',
    'Banana or wholegrain toast 60–90 minutes before training.':'प्रशिक्षण से 60–90 मिनट पहले केला या साबुत अनाज का टोस्ट।',
    'Tofu or paneer vegetable stir-fry with quinoa or wholegrain noodles.':'टोफू या पनीर की सब्ज़ी, क्विनोआ या साबुत अनाज नूडल्स के साथ।',
    'Besan chilla with vegetables and yoghurt.':'सब्ज़ियों और दही के साथ बेसन चिल्ला।',
    'Banana with peanut butter.':'पीनट बटर के साथ केला।',
    'Rajma with quinoa or brown rice and cucumber-tomato salad.':'राजमा, क्विनोआ या ब्राउन राइस और खीरा-टमाटर सलाद।',
    'Milk or fortified soy drink with fruit after training.':'प्रशिक्षण के बाद फल के साथ दूध या फोर्टिफाइड सोया ड्रिंक।',
    'Vegetable khichdi with extra moong dal and raita.':'अतिरिक्त मूंग दाल और रायते के साथ सब्ज़ी खिचड़ी।',
    'Greek yoghurt bowl with oats, fruit, pumpkin seeds and walnuts.':'ओट्स, फल, कद्दू के बीज और अखरोट के साथ ग्रीक योगर्ट बाउल।',
    'Roasted chickpeas and one piece of fruit.':'भुना चना और एक फल।',
    'Chole, two wholemeal rotis and a large mixed vegetable salad.':'छोले, दो साबुत आटे की रोटियाँ और बड़ा मिश्रित सब्ज़ी सलाद।',
    'Small boiled potato, fruit or toast before training.':'प्रशिक्षण से पहले छोटा उबला आलू, फल या टोस्ट।',
    'Tofu or paneer tikka bowl with vegetables and brown rice.':'सब्ज़ियों और ब्राउन राइस के साथ टोफू या पनीर टिक्का बाउल।',
    'Vegetable poha with peas, peanuts and a side of yoghurt.':'मटर, मूंगफली और दही के साथ सब्ज़ी पोहा।',
    'Fortified milk or soy drink with a small handful of nuts.':'थोड़े मेवों के साथ फोर्टिफाइड दूध या सोया ड्रिंक।',
    'Lentil pasta with tomato, spinach and mushrooms.':'टमाटर, पालक और मशरूम के साथ दाल पास्ता।',
    'Hummus with carrots, cucumber and wholegrain crackers.':'गाजर, खीरा और साबुत अनाज क्रैकर्स के साथ हम्मस।',
    'Palak tofu or palak paneer with wholemeal roti and salad.':'साबुत आटे की रोटी और सलाद के साथ पालक टोफू या पालक पनीर।',
    'Overnight oats with milk, chia, banana and cinnamon.':'दूध, चिया, केला और दालचीनी के साथ ओवरनाइट ओट्स।',
    'Banana, dates or toast before training.':'प्रशिक्षण से पहले केला, खजूर या टोस्ट।',
    'Chickpea salad wrap with hummus, colourful vegetables and wholegrain flatbread.':'हम्मस, रंगीन सब्ज़ियों और साबुत अनाज फ्लैटब्रेड के साथ चना सलाद रैप।',
    'Fruit-and-soy smoothie or yoghurt with fruit.':'फल और सोया स्मूदी या फल के साथ योगर्ट।',
    'Mixed dal, rice, vegetables and cucumber salad.':'मिश्रित दाल, चावल, सब्ज़ियाँ और खीरा सलाद।',
    'Smoothie with fortified soy or dairy milk, oats, berries and nut butter.':'फोर्टिफाइड सोया या डेयरी दूध, ओट्स, बेरी और नट बटर की स्मूदी।',
    'Orange or kiwi with pumpkin seeds.':'कद्दू के बीज के साथ संतरा या कीवी।',
    'Sambar with idli or dosa and extra vegetables.':'इडली या डोसा और अतिरिक्त सब्ज़ियों के साथ सांभर।',
    'Lassi, soy yoghurt or a small handful of nuts.':'लस्सी, सोया योगर्ट या थोड़े मेवे।',
    'Vegetable curry with tofu, chickpeas or paneer and a wholegrain side.':'टोफू, चना या पनीर की सब्ज़ी और साबुत अनाज साइड।',
    'Wholegrain toast with avocado and eggs or tofu scramble.':'एवोकाडो और अंडे या टोफू भुर्जी के साथ साबुत अनाज टोस्ट।',
    'Fruit and nuts.':'फल और मेवे।',
    'Large lentil and grain salad with colourful vegetables and tahini dressing.':'रंगीन सब्ज़ियों और ताहिनी ड्रेसिंग के साथ बड़ा दाल और अनाज सलाद।',
    'Yoghurt or soy yoghurt with seeds.':'बीजों के साथ दही या सोया योगर्ट।',
    'Vegetable and bean soup with wholegrain bread.':'साबुत अनाज ब्रेड के साथ सब्ज़ी और बीन्स सूप।'
  };

  const PLAN_HI = {
    'Full Body Foundation': 'फुल बॉडी फाउंडेशन',
    'Stamina + Core': 'स्टैमिना और कोर',
    'Lower Body + Glutes': 'लोअर बॉडी और ग्लूट्स',
    'Upper Body + Posture': 'अपर बॉडी और पोस्चर',
    'Full Body Conditioning': 'फुल बॉडी कंडीशनिंग',
    'Body Sculpt + Mobility': 'बॉडी शेप और मोबिलिटी'
  };

  const EXACT_HI = {
    'Health App': 'फिटनेस V4', 'Fitness V4': 'फिटनेस V4', 'Complete body training': 'संपूर्ण शरीर प्रशिक्षण', 'Offline ready': 'ऑफलाइन तैयार', 'Online': 'ऑनलाइन',
    'Language and voice coach':'भाषा और वॉइस कोच','App language':'ऐप भाषा','Spoken guidance':'बोला गया मार्गदर्शन','Voice preference':'वॉइस पसंद','Speaking speed':'बोलने की गति','Spoken countdown':'बोला गया काउंटडाउन','Form reminders':'तकनीक संकेत','On-screen subtitles':'स्क्रीन पर उपशीर्षक','Low-data video mode':'कम डेटा वीडियो मोड','Preview voice':'वॉइस सुनें','Voice coach':'वॉइस कोच','Repeat instruction':'निर्देश दोहराएँ','Stop voice':'वॉइस रोकें','Full instruction + cues':'पूरा निर्देश और संकेत','Essential cues':'केवल आवश्यक संकेत','Automatic':'स्वचालित','Female preferred':'महिला वॉइस प्राथमिक','Male preferred':'पुरुष वॉइस प्राथमिक','Slow':'धीमी','Normal':'सामान्य','Fast':'तेज़','Normal quality':'सामान्य गुणवत्ता','Poster until workout starts':'वर्कआउट शुरू होने तक चित्र',
    "TODAY'S GUIDED SESSION": 'आज का निर्देशित सत्र', 'Start workout': 'वर्कआउट शुरू करें', 'Preview plan': 'योजना देखें', 'Full-body video guidance': 'फुल-बॉडी वीडियो मार्गदर्शन',
    'QUICK READINESS CHECK': 'त्वरित तैयारी जाँच', 'How does your body feel today?': 'आज आपका शरीर कैसा महसूस कर रहा है?', 'Choose one': 'एक चुनें',
    'Fresh': 'ताज़ा', 'Okay': 'ठीक', 'Sore': 'मांसपेशियों में दर्द', 'Pain': 'दर्द', 'Normal plan': 'सामान्य योजना', 'Use control': 'नियंत्रित गति', 'Lower impact': 'कम प्रभाव', 'Stop and assess': 'रुकें और जाँचें',
    'YOUR WEEK': 'आपका सप्ताह', 'Six training days + recovery': 'छह प्रशिक्षण दिन + रिकवरी', 'Open plan': 'योजना खोलें', 'CURRENT GOAL': 'वर्तमान लक्ष्य', 'Change': 'बदलें',
    "TODAY'S FOOD": 'आज का भोजन', 'Vegetarian fuel': 'शाकाहारी पोषण', 'Open meals': 'भोजन योजना खोलें', 'Safety first': 'सुरक्षा पहले',
    'WORKOUT PROGRAM': 'वर्कआउट कार्यक्रम', 'Your six-day plan': 'आपकी छह दिन की योजना', 'Resume workout': 'वर्कआउट जारी रखें', 'training days': 'प्रशिक्षण दिन', 'minutes selected': 'चुने गए मिनट', 'guided exercises': 'निर्देशित व्यायाम', 'recovery day': 'रिकवरी दिन',
    'Choose a workout': 'वर्कआउट चुनें', 'Open six-day plan': 'छह दिन की योजना खोलें', 'Back': 'पीछे', 'Next': 'अगला', 'Easier option': 'आसान विकल्प', 'Progression': 'कठिन विकल्प', 'Replace': 'बदलें', '+15 seconds': '+15 सेकंड',
    'LEARN CORRECT FORM': 'सही तकनीक सीखें', 'Exercise and muscle library': 'व्यायाम और मांसपेशी लाइब्रेरी', 'Exercises': 'व्यायाम', 'Muscle map': 'मांसपेशी मानचित्र', 'All categories': 'सभी श्रेणियाँ', 'Warm-up': 'वार्म-अप', 'Strength': 'शक्ति', 'Cardio': 'कार्डियो', 'Core': 'कोर', 'Mobility': 'मोबिलिटी',
    'VEGETARIAN NUTRITION': 'शाकाहारी पोषण', 'Seven-day meal guidance': 'सात दिन की भोजन योजना', 'PROGRESS': 'प्रगति', 'Your training record': 'आपका प्रशिक्षण रिकॉर्ड',
    'PERSONALISE AND PROTECT DATA': 'व्यक्तिगत सेटिंग और डेटा सुरक्षा', 'Settings': 'सेटिंग्स', 'Profile and program': 'प्रोफ़ाइल और कार्यक्रम', 'Display name': 'नाम', 'Age range': 'आयु सीमा', 'Height (cm)': 'ऊँचाई (सेमी)', 'Weight (kg)': 'वज़न (किग्रा)', 'Main goal': 'मुख्य लक्ष्य', 'Fitness level': 'फिटनेस स्तर', 'Session duration': 'सत्र अवधि', 'Equipment': 'उपकरण', 'Diet style': 'आहार शैली', 'Excluded foods': 'न खाए जाने वाले खाद्य पदार्थ',
    'Display and guidance': 'डिस्प्ले और मार्गदर्शन', 'Theme': 'थीम', 'Sound cues': 'ध्वनि संकेत', 'Video autoplay': 'वीडियो ऑटोप्ले', 'Reduced motion': 'कम गति', 'Save settings': 'सेटिंग्स सहेजें',
    'OFFLINE EXERCISE VIDEOS': 'ऑफलाइन व्यायाम वीडियो', 'Download workout packs': 'वर्कआउट पैक डाउनलोड करें', 'Download all videos': 'सभी वीडियो डाउनलोड करें', 'Remove downloaded videos': 'डाउनलोड वीडियो हटाएँ',
    'Safety screening': 'सुरक्षा जाँच', 'Install Health App': 'फिटनेस V4 इंस्टॉल करें', 'Check for update': 'अपडेट जाँचें', 'Export backup': 'बैकअप निर्यात करें', 'Import backup': 'बैकअप आयात करें', 'Reset app data': 'ऐप डेटा रीसेट करें',
    'Home': 'होम', 'Workout': 'वर्कआउट', 'Diet': 'आहार', 'Progress': 'प्रगति', 'Why you are doing it': 'यह क्यों किया जा रहा है', 'How to do it': 'कैसे करें', 'Breathing and control': 'सांस और नियंत्रण', 'Easier': 'आसान', 'Harder': 'कठिन', 'Common mistake': 'सामान्य गलती',
    'MOVE': 'व्यायाम', 'REST / CHANGE': 'आराम / बदलाव', 'RECOVER': 'रिकवरी', 'STRETCH': 'स्ट्रेच', 'Recovery': 'रिकवरी', 'Hydration': 'पानी', 'Pause': 'रोकें', 'Play': 'चलाएँ', 'Poster only': 'केवल चित्र',
    'General fitness': 'सामान्य फिटनेस', 'Reduce body fat': 'शरीर की चर्बी कम करें', 'Improve stamina': 'स्टैमिना बढ़ाएँ', 'Shape and tone body': 'शरीर को आकार और टोन दें', 'Build strength': 'शक्ति बढ़ाएँ', 'Improve mobility': 'मोबिलिटी सुधारें',
    'Beginner': 'शुरुआती', 'Intermediate': 'मध्यम', 'Advanced': 'उन्नत', 'No equipment': 'बिना उपकरण', 'Resistance bands': 'रेज़िस्टेंस बैंड', 'Dumbbells': 'डम्बल', 'Full gym': 'पूरा जिम',
    'System': 'सिस्टम', 'Light': 'लाइट', 'Dark': 'डार्क', 'On': 'चालू', 'Off': 'बंद', 'Normal motion': 'सामान्य गति', 'Reduce motion': 'गति कम करें',
    'Indian vegetarian': 'भारतीय शाकाहारी', 'Vegetarian with dairy': 'डेयरी सहित शाकाहारी', 'Vegetarian with eggs': 'अंडे सहित शाकाहारी', 'Dairy + eggs': 'डेयरी + अंडे', 'Vegan': 'वीगन', 'High-protein vegetarian': 'उच्च-प्रोटीन शाकाहारी',
    'GUIDED WORKOUT PLAYBACK':'निर्देशित वर्कआउट प्लेबैक','Automatic exercise flow':'स्वचालित व्यायाम क्रम','Automatic next exercise':'अगला व्यायाम अपने आप','Next exercise preview':'अगले व्यायाम की झलक','Orientation preference':'स्क्रीन दिशा पसंद','Start in Focus Mode':'फोकस मोड में शुरू करें','Prefer portrait':'पोर्ट्रेट प्राथमिक','Prefer landscape':'लैंडस्केप प्राथमिक',
    'ACCOUNT & AUTOMATIC SYNC':'खाता और स्वचालित सिंक','Use the same progress on every device':'हर डिवाइस पर समान प्रगति','Continue with Google':'Google से जारी रखें','Email':'ईमेल','Password':'पासवर्ड','Sign in':'साइन इन','Create account':'खाता बनाएँ','Reset password':'पासवर्ड रीसेट','Sync now':'अभी सिंक करें','Sign out':'साइन आउट','Delete cloud data':'क्लाउड डेटा हटाएँ','Delete account':'खाता हटाएँ','Firebase setup required before first cloud sign-in':'पहले क्लाउड साइन-इन से पहले Firebase सेटअप आवश्यक',
    'Target muscles':'लक्षित मांसपेशियाँ','How to do':'कैसे करें','Breathing':'साँस','Common mistakes':'सामान्य गलतियाँ','Reps / time':'रेप्स / समय','Difficulty':'कठिनाई','Benefits':'लाभ','Next exercise':'अगला व्यायाम','Approved anatomy video':'स्वीकृत एनाटॉमी वीडियो','Voice and written guidance':'वॉइस और लिखित मार्गदर्शन','Focus mode':'फोकस मोड','Full screen':'फुल स्क्रीन',
    'Breakfast': 'नाश्ता', 'Lunch': 'दोपहर का भोजन', 'Dinner': 'रात का भोजन', 'Snack': 'स्नैक', 'Pre-workout': 'वर्कआउट से पहले', 'Recovery': 'रिकवरी', 'Replace': 'बदलें'
  };

  const MUSCLE_HI = {
    'Legs':'पैर','Heart':'हृदय','Shoulders':'कंधे','Upper back':'ऊपरी पीठ','Hips':'कूल्हे','Core':'कोर','Spine':'रीढ़','Hamstrings':'हैमस्ट्रिंग','Calves':'पिंडलियाँ','Balance':'संतुलन','Ankles':'टखने','Thighs':'जांघें','Glutes':'ग्लूट्स','Inner thighs':'अंदरूनी जांघें','Chest':'छाती','Triceps':'ट्राइसेप्स','Back':'पीठ','Arms':'बाँहें','Breathing':'सांस','Nervous system':'तंत्रिका तंत्र','Lower back':'निचली पीठ'
  };

  let prefs = loadPrefs();
  let translating = false;
  let lastSpokenExercise = '';
  let lastTimerCue = '';
  let availableVoices = [];
  const originalText = new WeakMap();

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREF_KEY) || localStorage.getItem(OLD_PREF_KEY) || '{}';
      const merged = {...DEFAULT_PREFS, ...JSON.parse(raw)};
      localStorage.setItem(PREF_KEY, JSON.stringify(merged));
      return merged;
    } catch { return {...DEFAULT_PREFS}; }
  }
  function savePrefs() {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    applyLanguage();
    window.dispatchEvent(new CustomEvent('fitness-v4-prefs-saved', {detail:{prefs:{...prefs}}}));
  }
  window.FitnessV4Voice = {
    getPrefs: () => ({...prefs}),
    applyPrefs: incoming => {
      prefs = {...DEFAULT_PREFS, ...(incoming || {})};
      localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
      applyLanguage();
      updateSubtitleVisibility();
      updateVoiceStatus();
    },
    speak,
    stopSpeech,
    getExerciseHindi: name => EXERCISE_HI[name] ? [...EXERCISE_HI[name]] : null,
    translateMuscle: name => MUSCLE_HI[name] || name
  };

  function tText(raw) {
    const text = String(raw || '');
    const trimmed = text.trim();
    if (!trimmed) return text;
    if (EXERCISE_HI[trimmed]) return EXERCISE_HI[trimmed][0];
    if (PLAN_HI[trimmed]) return PLAN_HI[trimmed];
    if (EXACT_HI[trimmed]) return EXACT_HI[trimmed];
    if (MUSCLE_HI[trimmed]) return MUSCLE_HI[trimmed];
    let m;
    if ((m = trimmed.match(/^Day (\d+)$/))) return `दिन ${m[1]}`;
    if ((m = trimmed.match(/^DAY (\d+)$/))) return `दिन ${m[1]}`;
    if ((m = trimmed.match(/^(\d+) minutes?$/))) return `${m[1]} मिनट`;
    if ((m = trimmed.match(/^(\d+) of (\d+)$/))) return `${m[1]} / ${m[2]}`;
    if ((m = trimmed.match(/^Stage (\d+) of (\d+)$/))) return `चरण ${m[1]} / ${m[2]}`;
    if ((m = trimmed.match(/^Target:\s*(.+)$/))) return `लक्षित मांसपेशियाँ: ${m[1].split(' · ').map(x => MUSCLE_HI[x] || x).join(' · ')}`;
    if ((m = trimmed.match(/^(\d+) sec movement · (\d+) sec change$/))) return `${m[1]} सेकंड व्यायाम · ${m[2]} सेकंड बदलाव`;
    if (trimmed === 'Move slowly with controlled breathing') return 'नियंत्रित सांस के साथ धीरे चलें';
    return text;
  }

  function translateNode(node) {
    if (node.nodeType !== Node.TEXT_NODE) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const en = originalText.get(node);
    const next = prefs.language === 'hi' ? tText(en) : en;
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function applyLanguage(root = document.body) {
    if (translating || !root) return;
    translating = true;
    document.documentElement.lang = prefs.language === 'hi' ? 'hi' : 'en';
    document.title = prefs.language === 'hi' ? 'फिटनेस V4' : 'Fitness V4';
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.parentElement || ['SCRIPT','STYLE'].includes(node.parentElement.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) translateNode(walker.currentNode);
    root.querySelectorAll?.('input[placeholder], textarea[placeholder]').forEach(el => {
      if (!el.dataset.enPlaceholder) el.dataset.enPlaceholder = el.placeholder;
      el.placeholder = prefs.language === 'hi' ? tText(el.dataset.enPlaceholder) : el.dataset.enPlaceholder;
    });
    root.querySelectorAll?.('option').forEach(el => {
      if (!el.dataset.enText) el.dataset.enText = el.textContent;
      el.textContent = prefs.language === 'hi' ? tText(el.dataset.enText) : el.dataset.enText;
    });
    updateDynamicExerciseLanguage();
    updateVoiceStatus();
    translating = false;
  }

  function getEnglishText(el) {
    if (!el) return '';
    if (el.dataset.enText) return el.dataset.enText.trim();
    for (const node of el.childNodes) if (node.nodeType === Node.TEXT_NODE && originalText.has(node)) return originalText.get(node).trim();
    return el.textContent.trim();
  }

  function currentEnglishExercise() {
    const el = document.getElementById('exerciseName');
    if (!el) return '';
    if (!el.dataset.v3EnglishName) {
      const visible = getEnglishText(el) || el.textContent.trim();
      const found = Object.keys(EXERCISE_HI).find(k => k === visible || EXERCISE_HI[k][0] === visible);
      if (found) el.dataset.v3EnglishName = found;
    }
    return el.dataset.v3EnglishName || '';
  }

  function updateDynamicExerciseLanguage() {
    const nameEl = document.getElementById('exerciseName');
    if (nameEl) {
      const visible = nameEl.textContent.trim();
      const found = Object.keys(EXERCISE_HI).find(k => k === visible || EXERCISE_HI[k][0] === visible);
      if (found) nameEl.dataset.v3EnglishName = found;
      const en = nameEl.dataset.v3EnglishName;
      if (en && EXERCISE_HI[en]) nameEl.textContent = prefs.language === 'hi' ? EXERCISE_HI[en][0] : en;
      const cue = document.getElementById('exerciseCue');
      if (cue && en && prefs.language === 'hi') cue.textContent = EXERCISE_HI[en][1];
    }
    document.querySelectorAll('.tag-row span').forEach(tag => {
      if (!tag.dataset.enText) tag.dataset.enText = tag.textContent;
      tag.textContent = prefs.language === 'hi' ? (MUSCLE_HI[tag.dataset.enText] || tText(tag.dataset.enText)) : tag.dataset.enText;
    });
    localiseMeals();
    const dialog = document.getElementById('exerciseDialog');
    if (dialog?.open) localiseDialog();
  }

  function localiseMeals() {
    if (prefs.language !== 'hi') return;
    document.querySelectorAll('.meal-card h2, .meal-preview span').forEach(el => {
      if (!el.dataset.v3MealEnglish) el.dataset.v3MealEnglish = getEnglishText(el) || el.textContent.trim();
      const en = el.dataset.v3MealEnglish;
      const key = Object.keys(MEAL_HI).find(k => en.includes(k));
      if (key) el.textContent = MEAL_HI[key];
    });
    document.querySelectorAll('.meal-card small').forEach(el => {
      if (!el.dataset.v3MealEnglish) el.dataset.v3MealEnglish = getEnglishText(el) || el.textContent.trim();
      el.textContent = 'अपनी भोजन पसंद, एलर्जी और लक्ष्य के अनुसार मात्रा बदलें। हर मुख्य भोजन में उचित प्रोटीन स्रोत रखें।';
    });
  }

  function localiseDialog() {
    if (prefs.language !== 'hi') return;
    const title = document.getElementById('dialogTitle');
    if (!title) return;
    const visible = title.textContent.trim();
    const en = Object.keys(EXERCISE_HI).find(k => k === visible || EXERCISE_HI[k][0] === visible);
    if (!en) return;
    title.textContent = EXERCISE_HI[en][0];
    const guide = EXERCISE_HI[en][1];
    const steps = guide.split('।').map(x => x.trim()).filter(Boolean);
    const list = document.getElementById('dialogSteps');
    if (list) list.innerHTML = steps.map(x => `<li>${x}।</li>`).join('');
    const benefit = document.getElementById('dialogBenefit');
    if (benefit) benefit.textContent = 'यह व्यायाम लक्षित मांसपेशियों की शक्ति, नियंत्रण और रोज़मर्रा की गतिविधियों की क्षमता सुधारने में मदद करता है।';
    const breath = document.getElementById('dialogBreathing');
    if (breath) breath.textContent = 'प्रयास करते समय सांस छोड़ें और आसान वापसी के दौरान सांस लें। सांस रोककर व्यायाम न करें।';
    const easier = document.getElementById('dialogEasier');
    if (easier) easier.textContent = 'गति और दायरा कम रखें। आवश्यकता हो तो दीवार, कुर्सी या आसान विकल्प का सहारा लें।';
    const harder = document.getElementById('dialogHarder');
    if (harder) harder.textContent = 'तकनीक सही रहते हुए समय, दायरा या प्रतिरोध केवल थोड़ा बढ़ाएँ।';
    const caution = document.getElementById('dialogCaution');
    if (caution) caution.textContent = 'तेज़, चुभने वाला या बढ़ता दर्द होने पर तुरंत रुकें। शरीर की स्थिति और सांस पर नियंत्रण बनाए रखें।';
  }

  function createV3Controls() {
    const form = document.getElementById('settingsForm');
    if (!form || document.getElementById('v3Language')) return;
    const heading = document.createElement('h2');
    heading.className = 'full v3-guide-heading';
    heading.textContent = 'Language and voice coach';
    const fields = document.createElement('div');
    fields.className = 'full v3-settings-grid';
    fields.innerHTML = `
      <label>App language<select id="v3Language"><option value="en">English</option><option value="hi">हिन्दी</option></select></label>
      <label>Spoken guidance<select id="v3VoiceGuide"><option value="off">Off</option><option value="essential">Essential cues</option><option value="full">Full instruction + cues</option></select></label>
      <label>Voice preference<select id="v3VoiceGender"><option value="auto">Automatic</option><option value="female">Female preferred</option><option value="male">Male preferred</option></select></label>
      <label>Speaking speed<select id="v3VoiceRate"><option value="0.82">Slow</option><option value="0.92">Normal</option><option value="1.05">Fast</option></select></label>
      <label>Spoken countdown<select id="v3Countdown"><option value="on">On</option><option value="off">Off</option></select></label>
      <label>Form reminders<select id="v3FormCues"><option value="on">On</option><option value="off">Off</option></select></label>
      <label>On-screen subtitles<select id="v3Subtitles"><option value="on">On</option><option value="off">Off</option></select></label>
      <label>Low-data video mode<select id="v3LowData"><option value="off">Normal quality</option><option value="on">Poster until workout starts</option></select></label>
      <div class="v3-voice-actions"><button id="v3PreviewVoice" class="secondary-btn" type="button">Preview voice</button><span id="v3VoiceStatus" class="subtle-chip">Checking voice…</span></div>
    `;
    const displayHeading = [...form.querySelectorAll('h2')].find(x => x.textContent.trim() === 'Display and guidance');
    if (displayHeading) { form.insertBefore(heading, displayHeading); form.insertBefore(fields, displayHeading); }
    else form.append(heading, fields);

    document.getElementById('v3Language').value = prefs.language;
    document.getElementById('v3VoiceGuide').value = prefs.voiceGuide;
    document.getElementById('v3VoiceGender').value = prefs.voiceGender;
    document.getElementById('v3VoiceRate').value = prefs.voiceRate;
    document.getElementById('v3Countdown').value = prefs.countdownVoice;
    document.getElementById('v3FormCues').value = prefs.formCues;
    document.getElementById('v3Subtitles').value = prefs.subtitles;
    document.getElementById('v3LowData').value = prefs.lowData;

    fields.querySelectorAll('select').forEach(sel => sel.addEventListener('change', () => {
      prefs = {
        ...prefs,
        language: document.getElementById('v3Language').value,
        voiceGuide: document.getElementById('v3VoiceGuide').value,
        voiceGender: document.getElementById('v3VoiceGender').value,
        voiceRate: document.getElementById('v3VoiceRate').value,
        countdownVoice: document.getElementById('v3Countdown').value,
        formCues: document.getElementById('v3FormCues').value,
        subtitles: document.getElementById('v3Subtitles').value,
        lowData: document.getElementById('v3LowData').value
      };
      savePrefs();
      updateSubtitleVisibility();
    }));
    document.getElementById('v3PreviewVoice').addEventListener('click', () => {
      speak(prefs.language === 'hi' ? 'नमस्ते। आपका फिटनेस वॉइस कोच तैयार है।' : 'Hello. Your Fitness V4 voice coach is ready.', {interrupt:true});
    });
  }

  function enhancePlayer() {
    const player = document.getElementById('workoutPlayer');
    const copy = player?.querySelector('.exercise-copy');
    if (!copy || document.getElementById('v3RepeatInstruction')) return;
    const box = document.createElement('div');
    box.className = 'v3-coach-panel';
    box.innerHTML = `
      <div class="v3-coach-title"><span aria-hidden="true">🔊</span><strong>Voice coach</strong><span id="v3CoachLanguage" class="subtle-chip">English</span></div>
      <p id="v3Subtitle" aria-live="polite">Press play to hear the exercise instructions.</p>
      <div class="button-row"><button id="v3RepeatInstruction" class="secondary-btn" type="button">Repeat instruction</button><button id="v3StopVoice" class="secondary-btn" type="button">Stop voice</button></div>
    `;
    copy.insertAdjacentElement('afterend', box);
    document.getElementById('v3RepeatInstruction').addEventListener('click', () => speakExercise(true));
    document.getElementById('v3StopVoice').addEventListener('click', stopSpeech);
    updateSubtitleVisibility();
  }

  function updateSubtitleVisibility() {
    const el = document.getElementById('v3Subtitle');
    if (el) el.classList.toggle('hidden', prefs.subtitles !== 'on');
    const lang = document.getElementById('v3CoachLanguage');
    if (lang) lang.textContent = prefs.language === 'hi' ? 'हिन्दी' : 'English';
  }

  function refreshVoices() {
    if (!('speechSynthesis' in window)) return;
    availableVoices = speechSynthesis.getVoices();
    updateVoiceStatus();
  }

  function selectVoice() {
    const langPrefix = prefs.language === 'hi' ? 'hi' : 'en';
    let voices = availableVoices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
    if (prefs.language === 'en') {
      const au = voices.filter(v => /en-AU/i.test(v.lang));
      if (au.length) voices = au;
    }
    if (prefs.voiceGender !== 'auto') {
      const femaleWords = /female|samantha|karen|moira|veena|lekha|aditi|rishi/i;
      const preferred = voices.filter(v => prefs.voiceGender === 'female' ? femaleWords.test(v.name) : !femaleWords.test(v.name));
      if (preferred.length) voices = preferred;
    }
    return voices.find(v => v.default) || voices[0] || null;
  }

  function updateVoiceStatus() {
    const el = document.getElementById('v3VoiceStatus');
    if (!el) return;
    if (!('speechSynthesis' in window)) { el.textContent = prefs.language === 'hi' ? 'वॉइस उपलब्ध नहीं' : 'Voice unavailable'; return; }
    const voice = selectVoice();
    el.textContent = voice ? `${voice.name} · ${voice.lang}` : (prefs.language === 'hi' ? 'हिन्दी वॉइस इंस्टॉल करें' : 'Using device default');
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const subtitle = document.getElementById('v3Subtitle');
    if (subtitle) subtitle.textContent = prefs.language === 'hi' ? 'वॉइस रोक दी गई।' : 'Voice stopped.';
  }

  function speak(text, opts = {}) {
    if (prefs.voiceGuide === 'off' || !text || !('speechSynthesis' in window)) return;
    if (opts.interrupt !== false) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = prefs.language === 'hi' ? 'hi-IN' : 'en-AU';
    u.rate = Number(prefs.voiceRate || 0.92);
    u.pitch = 1;
    const voice = selectVoice();
    if (voice) u.voice = voice;
    const subtitle = document.getElementById('v3Subtitle');
    if (subtitle && prefs.subtitles === 'on') subtitle.textContent = text;
    speechSynthesis.speak(u);
  }

  function currentInstruction(full = true) {
    const en = currentEnglishExercise();
    if (!en) {
      return prefs.language === 'hi' ? 'धीरे चलें, पानी पिएँ और अगले व्यायाम के लिए तैयार हों।' : 'Move gently, sip water and prepare for the next exercise.';
    }
    if (prefs.language === 'hi') {
      const item = EXERCISE_HI[en];
      return full ? `${item[0]}। ${item[1]}` : `${item[0]}। शरीर की स्थिति नियंत्रित रखें।`;
    }
    const cue = document.getElementById('exerciseCue')?.textContent.trim() || '';
    return full ? `${en}. ${cue}` : `${en}. Keep the movement controlled.`;
  }

  function speakExercise(forceFull = false) {
    if (prefs.voiceGuide === 'off') return;
    const en = currentEnglishExercise();
    const full = forceFull || prefs.voiceGuide === 'full';
    speak(currentInstruction(full), {interrupt:true});
    lastSpokenExercise = en;
  }

  function sayTimerCue(seconds) {
    if (prefs.voiceGuide === 'off') return;
    const key = `${currentEnglishExercise()}-${seconds}`;
    if (lastTimerCue === key) return;
    lastTimerCue = key;
    let text = '';
    if (seconds === 10 && prefs.countdownVoice === 'on') text = prefs.language === 'hi' ? 'दस सेकंड बाकी।' : 'Ten seconds remaining.';
    else if (seconds === 30 && prefs.formCues === 'on') text = prefs.language === 'hi' ? 'आधा समय पूरा। तकनीक नियंत्रित रखें और सांस सामान्य रखें।' : 'Halfway. Keep your form controlled and breathe steadily.';
    if (text) speak(text, {interrupt:false});
  }

  function bindCoachEvents() {
    const play = document.getElementById('playPauseBtn');
    const next = document.getElementById('nextStepBtn');
    const prev = document.getElementById('prevStepBtn');
    const close = document.getElementById('closeWorkoutBtn');
    play?.addEventListener('click', () => setTimeout(() => {
      if (play.textContent.includes('❚')) speakExercise(false); else stopSpeech();
    }, 80));
    next?.addEventListener('click', () => setTimeout(() => { lastTimerCue=''; speakExercise(false); applyLanguage(); }, 100));
    prev?.addEventListener('click', () => setTimeout(() => { lastTimerCue=''; speakExercise(false); applyLanguage(); }, 100));
    close?.addEventListener('click', stopSpeech);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopSpeech(); });
  }

  function installMutationObserver() {
    let scheduled = false;
    const roots = new Set();
    let timerChanged = false;
    let exerciseChanged = false;
    let mediaChanged = false;

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        if (translating) return;

        for (const root of roots) {
          if (root?.isConnected) applyLanguage(root);
        }
        roots.clear();

        if (exerciseChanged) {
          exerciseChanged = false;
          const name = document.getElementById('exerciseName');
          if (name) {
            const raw = name.textContent.trim();
            const en = Object.keys(EXERCISE_HI).find(k => k === raw || EXERCISE_HI[k][0] === raw);
            if (en && name.dataset.v3EnglishName !== en) {
              name.dataset.v3EnglishName = en;
              lastTimerCue = '';
              if (document.getElementById('playPauseBtn')?.textContent.includes('❚') && en !== lastSpokenExercise) speakExercise(false);
            }
          }
          updateDynamicExerciseLanguage();
        }

        if (timerChanged) {
          timerChanged = false;
          const timer = document.getElementById('timerDisplay')?.textContent.trim();
          if (timer && /^\d{2}:\d{2}$/.test(timer)) {
            const [m,s] = timer.split(':').map(Number);
            const total = m * 60 + s;
            if (total === 30 || total === 10) sayTimerCue(total);
          }
        }
        if (mediaChanged) { mediaChanged = false; applyLowDataMode(); }
      });
    };

    const observer = new MutationObserver(records => {
      if (translating) return;
      for (const record of records) {
        const parent = record.target.nodeType === Node.TEXT_NODE ? record.target.parentElement : record.target;
        if (parent?.id === 'timerDisplay' || parent?.closest?.('#timerDisplay')) {
          timerChanged = true;
          continue;
        }
        if (parent?.id === 'exerciseName' || parent?.closest?.('#exerciseName')) {
          exerciseChanged = true;
          continue;
        }
        if (record.type === 'childList') {
          mediaChanged = true;
          record.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) roots.add(node);
            else if (node.parentElement) roots.add(node.parentElement);
          });
        } else if (parent && !parent.closest?.('video')) {
          roots.add(parent);
        }
      }
      schedule();
    });
    observer.observe(document.body, {subtree:true, childList:true, characterData:true});
  }

  function applyLowDataMode() {
    if (prefs.lowData !== 'on') return;
    document.querySelectorAll('video').forEach(v => {
      if (!v.closest('#workoutPlayer')) { v.pause(); v.removeAttribute('autoplay'); v.preload='none'; }
    });
  }

  function boot() {
    document.querySelector('.brand-button strong').textContent = 'Fitness V4';
    document.querySelector('.brand-button small').textContent = 'Bilingual anatomy workouts';
    const actions = document.querySelector('.header-actions');
    if (actions && !document.getElementById('v3QuickLanguage')) {
      const quick = document.createElement('button');
      quick.id = 'v3QuickLanguage'; quick.className = 'icon-btn v3-language-toggle'; quick.type = 'button';
      quick.setAttribute('aria-label','Switch English and Hindi');
      quick.textContent = prefs.language === 'hi' ? 'EN' : 'हि';
      quick.addEventListener('click', () => { prefs.language = prefs.language === 'hi' ? 'en' : 'hi'; savePrefs(); quick.textContent = prefs.language === 'hi' ? 'EN' : 'हि'; const sel=document.getElementById('v3Language'); if(sel) sel.value=prefs.language; const onboard=document.getElementById('onboardV3Language'); if(onboard) onboard.value=prefs.language; });
      actions.insertBefore(quick, document.getElementById('headerSettingsBtn'));
    }
    const onboardingForm = document.getElementById('onboardingForm');
    if (onboardingForm && !document.getElementById('onboardV3Language')) {
      const label = document.createElement('label'); label.className='full'; label.innerHTML='App language<select id="onboardV3Language"><option value="en">English</option><option value="hi">हिन्दी</option></select>';
      onboardingForm.prepend(label); const sel=label.querySelector('select'); sel.value=prefs.language; sel.addEventListener('change',()=>{prefs.language=sel.value;savePrefs();const main=document.getElementById('v3Language');if(main)main.value=prefs.language;const q=document.getElementById('v3QuickLanguage');if(q)q.textContent=prefs.language==='hi'?'EN':'हि';});
    }
    const badge = document.getElementById('appVersion'); if (badge) badge.textContent = 'fitness-v4.0.0-preview';
    createV3Controls();
    enhancePlayer();
    bindCoachEvents();
    refreshVoices();
    if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = refreshVoices;
    installMutationObserver();
    applyLanguage();
    updateSubtitleVisibility();
    setTimeout(applyLowDataMode, 500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
