export function review(text,kind='story') {
 const words=text.trim().split(/\s+/).filter(Boolean), strengths=[], gaps=[];
 const patterns=kind==='motivation' ? [['تجربة محددة',/تدريب|مشروع|جامعة|جامع|تطوع|نادي|intern|project|university/i,'اربط دافعك بتجربة محددة عشتها.'],['الدافع',/لأن|لان|أحب|احب|أهتم|اهتم|استمتع|because|enjoy|interest/i,'وضح ليش يهمك هذا المجال، بمثال من تجربتك.']] : [['السياق',/مشروع|فريق|جامعة|جامع|تدريب|نادي|تطوع|project|team|intern/i,'حدد الموقف ومسؤوليتك فيه.'],['مساهمتك',/نظمت|نظّمت|اقترحت|قدت|حللت|حلّلت|قررت|قرّرت|تواصلت|قسمت|وزعت|بدأت|سويت|i (led|built|created|decided|organized)/i,'وش سويت أنت تحديدًا؟ اذكر قرارًا وسبب اتخاذه.'],['النتيجة',/نتيجة|حقق|تحسن|تحسّن|زاد|انخفض|وصل|نجح|سلّم|سلمنا|result|improv|reduc|achiev/i,'وش تغير بعد تصرفك؟ اذكر نتيجة فعلية يمكن وصفها.']];
 for(const [label,re,tip] of patterns){const hit=text.match(re);if(hit){const at=hit.index;strengths.push({label:'إشارة إلى '+label,quote:text.slice(Math.max(0,at-22),Math.min(text.length,at+65)),detail:'ظهرت هذه الإشارة في النص؛ راجع إن كانت واضحة ومكتملة في سياق قصتك.'})}else gaps.push(tip)}
 if(words.length<25)gaps.push('الإجابة مختصرة جدًا للتفصيل. أضف مثالًا يوضح كلامك.');
 if(words.length>220)gaps.push('الإجابة طويلة نسبيًا. جرّب حذف التفاصيل التي لا تخدم السؤال.');
 const fillers=(text.match(/(?:^|\s)(?:أمم|اممم|يعني|uh|um)(?=\s|[،,.!?]|$)/gi)||[]).length;
 if(fillers>=3)gaps.push(`ظهرت ألفاظ مثل «يعني / أمم» ${fillers} مرات. راجع ضرورتها؛ وجودها بالنص لا يثبت ترددًا صوتيًا.`);
 if(!gaps.length)gaps.push('راجع ارتباط القصة بالسؤال، ووضّح لماذا اخترت تصرفك بدل البدائل.');
 return {words:words.length,strengths,gaps,followup:gaps[0],label:strengths.length===patterns.length?'ظهرت إشارات الهيكل الأساسية':'تحتاج تفاصيل أوضح'};
}
export function isNonAnswer(text) {
 const normalized=text.normalize('NFKC').replace(/[أإآ]/g,'ا').replace(/[\u064B-\u065F\u0640]/g,'').toLowerCase();
 const tokens=normalized.match(/[\p{L}\p{N}]+/gu)||[];
 if(!tokens.length)return true;
 const social=new Set(['اهلا','اهلين','هلا','مرحبا','السلام','عليكم','وعليكم','هاي','هلو','hello','hi','hey','شكرا','شكرًا','thanks','test','تجربة','تست','هههه','هه']);
 if(tokens.every(t=>social.has(t)||/^ه{3,}$/.test(t)))return true;
 if(tokens.length>2&&new Set(tokens).size===1)return true;
 return false;
}
export function relevance(text, question, kind='story', followup=false) {
 if(isNonAnswer(text))return false;
 const n=text.normalize('NFKC').replace(/[أإآ]/g,'ا').replace(/[\u064B-\u065F\u0640]/g,'').toLowerCase();
 // Conservative local relevance cues, not a semantic AI judgment.
 const context=/تجرب|موقف|مشروع|فريق|عمل|شغل|وظيف|تدريب|جامع|دراس|تخصص|تطوع|نادي|استشار|مهني|شركة|شركه|شركات|زميل|عميل|قياد|قدت|اقترحت|قررت|واجهت|تعلمت|تعلم|مسؤول|مسئول|مهام|خلاف|اقنع|اخفاق|فشل|انجاز|نظمت|انضممت|تخرج|طموح|هدف|career|consult|work|team|project|study|university|intern|experience|led|lead|colleague|client|learn|challenge|fail|graduate|business|degree|job/;
 const detail=/نتيج|حقق|تحسن|زاد|انخفض|سلمنا|موعد|وقت|ميزاني|تكلف|قسمت|وزعت|تواصلت|لان|بسبب|اخترت|قرر|because|result|improv|reduc|budget|deadline|decided/;
 if(context.test(n))return true;
 if(followup&&detail.test(n))return true;
 return null; // Uncertain answers continue to clarification; never reject solely for missing keywords.
}
