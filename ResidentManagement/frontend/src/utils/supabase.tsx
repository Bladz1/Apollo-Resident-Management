import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function uploadFeedbackFile(file: File): Promise<string> {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File must be <= 5MB');
  }

  const allowedTypes = ['image/', 'application/pdf'];
  if (!allowedTypes.some((t) => file.type.startsWith(t))) {
    throw new Error('Only images or PDFs are allowed');
  }

  const ext = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = `feedbacks/${fileName}`;

  const { error } = await supabase.storage
    .from('feedback-files')
    .upload(filePath, file, {
      upsert: false,
    });

  if (error) {
    console.error(error);
    throw new Error('Upload file thất bại');
  }

  const { data } = supabase.storage
    .from('feedback-files')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
export { uploadFeedbackFile };
