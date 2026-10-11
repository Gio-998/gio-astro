import type { Element } from "@/engine/zodiac";
import type { AttachStyle, Dosha } from "@/engine/quizzes";
import type { Temperament } from "@/engine/bigfive";

type E4 = Record<Element, string>;

/** Sun element × Moon element: how your core self and your emotional self speak to each other. */
export const sunMoon: Record<Element, E4> = {
  fire: {
    fire: "Your core self and your emotional self burn with the same fire. What you want and what you feel are rarely in conflict — you know your heart and you act on it. The gift is enormous vitality and honesty; the risk is that there is no inner water to cool you down, so rest and reflection have to be chosen on purpose.",
    earth: "Your fiery core wants adventure and action, while your earthy heart wants safety, comfort and things that last. You may feel the pull of a bold idea and then need time to make sure it's solid. Together they make you a rare type: an inspired builder who can actually finish the dream.",
    air: "Fire and air feed each other: your will is fanned by ideas and conversation, and your feelings move quickly through words. You are lively, persuasive and optimistic. Your growth is to slow down enough to feel what you think — and not only think what you feel.",
    water: "Your fiery core is bold and outward, but your heart is a deep, sensitive sea. Outsiders may see only the confidence; those close to you know how much you feel. Steam is what happens when fire meets water — you are capable of intense passion and also of feeling overwhelmed. Honour both: action for the fire, quiet for the water.",
  },
  earth: {
    fire: "Your core is steady and practical, but your emotional life has a spark of fire — you feel boldly and react quickly, sometimes surprising people who thought you were calm. The earth gives your fire a hearth; the fire gives your earth warmth and motivation.",
    earth: "Your core and your heart are both made of earth: grounded, loyal, practical and patient. You know what you value and you build toward it steadily. People find you deeply reassuring. Your risk is getting stuck — choose small doses of novelty to keep the soil fertile.",
    air: "Your practical core meets a heart that processes through ideas and talk. You may analyse your feelings and then build sensible plans around them. You combine common sense with curiosity — a fine combination for solving real problems, as long as you let the feelings be felt, not only sorted.",
    water: "Earth and water make a garden. Your core is practical and steady; your heart is deep, caring and intuitive. You naturally nurture people and things, and you feel safest with loyal people and a real home. Guard against worry and over-caring; you are the soil, not the whole forest.",
  },
  air: {
    fire: "Your thinking core is set alight by a fiery heart. You feel passionately about ideas, people and causes, and you speak your feelings quickly. You are inspiring, warm and a little impatient. Let some feelings simmer before they become declarations.",
    earth: "Your airy core loves ideas, while your heart wants solid ground. You may dream big and then feel safe only when the plan is practical. This gives you an unusual gift: making ideas real. Remember to let your heart enjoy simple comforts, not only plans.",
    air: "Your core and heart both live in the air: you understand feelings by thinking and talking about them, and you need mental connection to feel close. You are open, social and fair-minded. The risk is living in your head — your body and deeper feelings deserve a voice too.",
    water: "Your thinking core meets a deep, emotional heart. You can understand people intellectually and feel them intuitively — a powerful mix for writing, counselling or art. Sometimes the mind tries to explain away what the heart knows; let them talk to each other.",
  },
  water: {
    fire: "Your core is deep and feeling, but your heart reacts with fire — quick, passionate, sometimes fierce. You may be sensitive and then suddenly bold. Your passion protects your softness; your softness gives your passion meaning.",
    earth: "Your water core is intuitive and feeling, and your heart seeks solid ground. You feel deeply and then soothe yourself through routine, comfort and practical care. You are deeply nurturing and steady — a safe place for others.",
    air: "Your core is deep and emotional, but your heart processes at a little distance, through understanding and talk. You may feel things intensely and then step back to analyse them. This gives you both empathy and perspective.",
    water: "Your core and your heart are both oceans. You feel everything, sense the unspoken and love with your whole being. Intuition guides you. The challenge is boundaries: knowing which feelings are yours. Water also needs a riverbank to flow strongly.",
  },
};

/** Attachment × Venus element — how your attachment pattern colours your style of love. */
export const attachVenus: Record<AttachStyle, E4> = {
  secure: {
    fire: "Your secure base gives your fiery Venus something precious: passion without panic. You can pursue, flirt and adore without needing constant proof in return.",
    earth: "Security plus an earthy Venus makes you one of the most reliable lovers in the zodiac: loyal, sensual and calm. Remember to add surprise.",
    air: "Your secure heart and airy Venus make love feel like a great friendship: honest, light and equal.",
    water: "Your secure base lets your watery Venus love deeply without drowning. You can be tender and still keep your shape.",
  },
  anxious: {
    fire: "Your fiery Venus loves boldly, and your anxious attachment can turn that boldness into chasing. When you feel unsure, pause before pursuing — passion lands better when it isn't fear in disguise.",
    earth: "Your earthy Venus wants steady loyalty, and your anxious attachment notices every wobble in it. Concrete, consistent partners soothe you most; tell them that predictability is romance to you.",
    air: "Your airy Venus loves through words, and anxiety may make you reread every message. Ask for the conversation you need instead of decoding the one you got.",
    water: "Your watery Venus loves with total devotion, and anxiety can make you fear the tide going out. Grounding yourself in friendships and routines keeps your love from becoming your whole ocean.",
  },
  avoidant: {
    fire: "Your fiery Venus feels attraction strongly, and your avoidant pattern may cool it suddenly when things get serious. Notice the moment you want to run — it often comes right before real closeness.",
    earth: "Your earthy Venus is loyal, and your avoidant pattern shows love through actions rather than feelings. Partners may need words too; a few go a long way.",
    air: "Airy Venus plus avoidant attachment makes you love freedom and friendship in love — and keep feelings intellectual. Letting someone see your softer side is your next adventure.",
    water: "Your watery Venus feels deeply, but your avoidant pattern may hide it. You may love someone intensely from a careful distance. Let one person in, slowly.",
  },
  fearful: {
    fire: "Your fiery Venus rushes toward love, while fear pulls you back — a push-pull that can feel dramatic. Slow, steady partners give your fire a safe hearth.",
    earth: "Your earthy Venus longs for stability, and fear makes trusting it hard. Build trust in small, kept promises, and let time do its quiet work.",
    air: "Your airy Venus wants connection through talk, and fear may make you test or retreat. Naming your mixed feelings aloud is often the bridge.",
    water: "Your watery Venus loves deeply and fears deeply. Gentle, consistent people and supportive friendships help your heart learn that love can be safe.",
  },
};

/** Big Five emotional sensitivity (N band) × Moon element. */
export const sensitivityMoon: Record<"low" | "mid" | "high", E4> = {
  low: { fire: "Your fiery Moon and calm nervous system make you quick to feel and quick to recover — a resilient spirit.", earth: "Your earthy Moon and calm nerves make you unusually steady; people lean on you in crises.", air: "Your airy Moon and steady nerves let you discuss feelings with clarity and calm.", water: "Your watery Moon feels deeply, yet your nervous system stays steady — depth without drowning." },
  mid: { fire: "Your fiery Moon flares and settles; your moderate sensitivity means you feel stress but bounce back.", earth: "Your earthy Moon and balanced sensitivity give you calm with real feeling underneath.", air: "Your airy Moon helps you talk through stress, and you usually find balance.", water: "Your watery Moon feels a lot, and you usually recover with time and care." },
  high: { fire: "Your fiery Moon and high sensitivity can make emotions feel like wildfire. Physical outlets and cooling pauses are your best medicine.", earth: "Your earthy Moon wants calm, and your sensitive nervous system worries when it can't find it. Routines and nature are especially healing for you.", air: "Your airy Moon and high sensitivity can turn feelings into racing thoughts. Writing and talking to one calm person help clear the sky.", water: "Your watery Moon and high sensitivity make you an emotional ocean. You need regular solitude, gentle people and clear boundaries — and your empathy is a true gift." },
};

/** Conscientiousness band × Sun modality — how you work. */
export const workStyle: Record<"low" | "mid" | "high", Record<"cardinal" | "fixed" | "mutable", string>> = {
  low: { cardinal: "You're a starter with a flexible style: brilliant at launching, less keen on maintenance. Partner with finishers.", fixed: "You're steady in purpose but relaxed in method — loyal to the goal, improvising the path.", mutable: "You're adaptable through and through: great in chaos, challenged by routine. External deadlines are your friends." },
  mid: { cardinal: "You initiate and can also organise the follow-through when it matters.", fixed: "You keep going with balanced discipline — persistent without being rigid.", mutable: "You adapt easily and can still organise yourself when needed." },
  high: { cardinal: "You start and finish: a natural leader who makes plans and carries them out.", fixed: "You are relentlessly reliable: once committed, you see it through to the end.", mutable: "You combine flexibility with discipline — able to adapt plans without losing quality." },
};

/** Dosha × temperament — your body–mind pattern. */
export const doshaTemperament: Record<Dosha, Record<Temperament, string>> = {
  vata: { sanguine: "Airy body, airy mind: you're light, quick and sociable. Grounding routines keep your sparkle from turning into scattered tiredness.", choleric: "A quick, airy body with a fiery drive: you push hard in bursts. Watch your energy reserves.", melancholic: "A light body with a deep, thoughtful mind: creative but prone to worry. Warmth and routine soothe you.", phlegmatic: "A light, changeable body with a calm temperament: unusual balance. Keep a steady rhythm." },
  pitta: { sanguine: "A warm, strong body and a sociable mind: charismatic and energetic.", choleric: "Fire on fire: sharp, driven and passionate. Cooling practices and play keep you from burning out.", melancholic: "A warm, intense body with a deep mind: focused and perfectionistic. Be gentle with yourself.", phlegmatic: "A warm body with a calm mind: focused yet steady." },
  kapha: { sanguine: "A steady body with a sociable mind: warm, reliable and fun.", choleric: "A strong, enduring body with a driven mind: powerful and persistent.", melancholic: "A steady body with a deep mind: loyal and thoughtful. Movement and novelty keep you light.", phlegmatic: "Earth and water through and through: calm, loyal, patient. Stimulation and movement keep you vibrant." },
};

/** When several lenses point to the same element. */
export const elementVoice: E4 = {
  fire: "action, courage, enthusiasm and a need to be seen and to move",
  earth: "steadiness, loyalty, practicality and a need for safety and real results",
  air: "ideas, connection, curiosity and a need for freedom and conversation",
  water: "feeling, intuition, depth and a need for closeness and meaning",
};
export const elementMissing: E4 = {
  fire: "With little fire, motivation and self-assertion may need to be cultivated. Sun, movement, music and bold small acts bring warmth.",
  earth: "With little earth, practical routines and the body may need attention. Regular meals, nature and simple plans bring grounding.",
  air: "With little air, perspective and communication may need attention. Reading, talking and fresh air bring lightness.",
  water: "With little water, feelings and rest may need attention. Water, music, art and tender time bring flow.",
};
export const elementBoost: E4 = {
  fire: "Air and fire people tend to boost you: air fans your flame with ideas and freedom, fire matches your pace. Earth and water steady and deepen you — less easy, often more growth.",
  earth: "Water and earth people tend to boost you: water nourishes your soil, earth shares your rhythm. Fire and air bring movement and inspiration you might otherwise miss.",
  air: "Fire and air people tend to boost you: fire gives your ideas heat, air shares your love of talk. Earth and water ground and deepen you.",
  water: "Earth and water people tend to boost you: earth gives your water a riverbank, water understands without words. Fire and air bring energy and perspective.",
};
export const elementRitual: E4 = {
  fire: "Fire ritual: light a candle at sunrise or sunset, name one brave act for the day, and move your body until you feel warm.",
  earth: "Earth ritual: walk barefoot, tend a plant or cook slowly, naming three things you are grateful for in your body.",
  air: "Air ritual: open a window, take ten slow breaths, and write freely for five minutes without stopping.",
  water: "Water ritual: take a slow bath or shower, imagine releasing the day, and listen to one piece of music with eyes closed.",
};

export const attachBoost: Record<AttachStyle, string> = {
  secure: "You are boosted by people who are also secure — and you can be a healing presence for anxious or avoidant friends, as long as the effort is shared.",
  anxious: "You are boosted most by secure, consistent people who reply, keep promises and say what they feel. Exciting-but-unpredictable people tend to feed the anxiety rather than heal it.",
  avoidant: "You are boosted most by secure people who give you room without punishing you for it — and who gently invite you closer.",
  fearful: "You are boosted most by calm, patient, consistent people — and by supportive friendships, which can be as healing as romance.",
};
export const attachHeal: Record<AttachStyle, string> = {
  secure: "You heal through honest conversation and reliable connection — and by keeping your own needs on the table.",
  anxious: "You heal by building inner safety: self-soothing, friendships that hold you, and relationships where actions match words.",
  avoidant: "You heal by letting small amounts of care in, and discovering that being needed does not have to mean being trapped.",
  fearful: "You heal slowly and surely with consistent, safe people, grounding practices and, if old pain is heavy, a good therapist.",
};
export const doshaBoost: Record<Dosha, string> = {
  vata: "Grounded, warm, steady people (often kapha types) help you settle; fellow airy types spark ideas but may leave you both scattered.",
  pitta: "Calm, cooling, easy-going people help you soften; fellow fire types inspire you but can compete.",
  kapha: "Lively, energetic people (vata or pitta types) get you moving; fellow steady types feel cosy but may keep you both still.",
};

/** Jupiter (growth) and Saturn (lessons) by solar house — counting from your Sun sign. */
export const jupiterHouse: string[] = [
  "Jupiter moves through your own sign: a year of personal growth, confidence and new beginnings. Say yes to opportunities to expand yourself.",
  "Jupiter moves through your house of resources: chances to grow income, skills and self-worth. Invest in what you value.",
  "Jupiter moves through your house of communication: learning, writing, short trips and good conversations open doors.",
  "Jupiter moves through your house of home: a good time for family, a new home, or healing your roots.",
  "Jupiter moves through your house of joy: romance, creativity, play and children bring blessings. Have more fun.",
  "Jupiter moves through your house of work and health: better routines, a healthier body and more satisfying daily work.",
  "Jupiter moves through your house of partnership: relationships grow, and important people may enter your life.",
  "Jupiter moves through your house of depth: intimacy, shared resources and inner transformation expand.",
  "Jupiter moves through your house of horizons: travel, study and big ideas call you.",
  "Jupiter moves through your house of career: recognition and professional growth are possible. Aim higher.",
  "Jupiter moves through your house of friendship: community, networks and hopes for the future bloom.",
  "Jupiter moves through your house of the inner world: a quieter year of spiritual growth, rest and preparation for a fresh cycle.",
];
export const saturnHouse: string[] = [
  "Saturn moves through your own sign: a serious, maturing time. Take responsibility for who you are becoming.",
  "Saturn tests your finances and self-worth: budget, build skills, value yourself realistically.",
  "Saturn asks for discipline in learning and communication: study, write, say what you mean.",
  "Saturn works on your foundations: home, family duties and inner security need structure.",
  "Saturn asks for commitment in love and creativity: serious projects, serious hearts.",
  "Saturn organises your work and health: steady routines now pay off for years.",
  "Saturn tests partnerships: commitments deepen or end. Clarity in relationships.",
  "Saturn moves through your house of depth: shared money, intimacy and old fears ask for honest work.",
  "Saturn structures your beliefs and studies: long courses, serious travel, a mature philosophy.",
  "Saturn moves through your career sector: hard work, responsibility and real authority.",
  "Saturn tests friendships and goals: fewer, truer friends; realistic long-term hopes.",
  "Saturn moves through your inner world: rest, closure and quiet preparation. Let go of what's complete.",
];
