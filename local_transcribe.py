import sys, json, io
from pathlib import Path

class UserError(Exception):
    pass

def main():
    raw = sys.stdin.buffer.read(12 * 1024 * 1024 + 1)
    if not raw or len(raw) > 12 * 1024 * 1024:
        raise UserError('الملف فارغ أو أكبر من 12 ميجابايت.')
    from faster_whisper import WhisperModel
    model_path = Path(__file__).resolve().parent / 'models' / 'whisper-small'
    if not (model_path / 'model.bin').is_file():
        raise UserError('الموديل المحلي غير موجود. تأكد من مجلد models/whisper-small.')
    model = WhisperModel(str(model_path), device='cpu', compute_type='int8', local_files_only=True)
    segments, _ = model.transcribe(io.BytesIO(raw), beam_size=3, vad_filter=True)
    text = ' '.join(segment.text.strip() for segment in segments).strip()
    print(json.dumps({'text': text}, ensure_ascii=False))

try:
    main()
except Exception as exc:
    message = str(exc) if isinstance(exc, UserError) else 'تعذر قراءة التسجيل. جرّب ملفًا صوتيًا صالحًا أو سجل مرة أخرى.'
    print(json.dumps({'error': message}, ensure_ascii=False))
    sys.exit(1)
