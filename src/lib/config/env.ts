type PublicEnvironment = {
  supabaseUrl: string;
  supabasePublishableKey: string;
};

function required(name: string, value: string | undefined): string {
  if (!value?.trim()) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function getPublicEnvironment(): PublicEnvironment {
  return {
    supabaseUrl: required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabasePublishableKey: required(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
  };
}
