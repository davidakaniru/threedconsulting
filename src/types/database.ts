export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      audit_logs: {
        Row: { action: string; actor_id: string | null; created_at: string; entity_id: string | null; entity_type: string; id: number; metadata: Json };
        Insert: { action: string; actor_id?: string | null; created_at?: string; entity_id?: string | null; entity_type: string; id?: number; metadata?: Json };
        Update: { action?: string; actor_id?: string | null; created_at?: string; entity_id?: string | null; entity_type?: string; id?: number; metadata?: Json };
        Relationships: [{ foreignKeyName: "audit_logs_actor_id_fkey"; columns: ["actor_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      parents: {
        Row: { activated_at: string | null; created_at: string; id: string; invited_at: string; occupation: string | null; onboarding_status: Database["public"]["Enums"]["parent_onboarding_status"]; updated_at: string };
        Insert: { activated_at?: string | null; created_at?: string; id: string; invited_at?: string; occupation?: string | null; onboarding_status?: Database["public"]["Enums"]["parent_onboarding_status"]; updated_at?: string };
        Update: { activated_at?: string | null; created_at?: string; id?: string; invited_at?: string; occupation?: string | null; onboarding_status?: Database["public"]["Enums"]["parent_onboarding_status"]; updated_at?: string };
        Relationships: [{ foreignKeyName: "parents_id_fkey"; columns: ["id"]; isOneToOne: true; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      student_parents: {
        Row: { created_at: string; is_primary_contact: boolean; parent_id: string; relationship: Database["public"]["Enums"]["guardian_relationship"]; student_id: string };
        Insert: { created_at?: string; is_primary_contact?: boolean; parent_id: string; relationship: Database["public"]["Enums"]["guardian_relationship"]; student_id: string };
        Update: { created_at?: string; is_primary_contact?: boolean; parent_id?: string; relationship?: Database["public"]["Enums"]["guardian_relationship"]; student_id?: string };
        Relationships: [
          { foreignKeyName: "student_parents_parent_id_fkey"; columns: ["parent_id"]; isOneToOne: false; referencedRelation: "parents"; referencedColumns: ["id"] },
          { foreignKeyName: "student_parents_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "students"; referencedColumns: ["id"] }
        ];
      };
      profiles: {
        Row: {
          address: string | null;
          avatar_url: string | null;
          created_at: string;
          date_of_birth: string | null;
          email: string;
          first_name: string | null;
          id: string;
          last_name: string | null;
          phone: string | null;
          preferred_language: string;
          role: Database["public"]["Enums"]["user_role"];
          status: Database["public"]["Enums"]["profile_status"];
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email: string;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          phone?: string | null;
          preferred_language?: string;
          role?: Database["public"]["Enums"]["user_role"];
          status?: Database["public"]["Enums"]["profile_status"];
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          phone?: string | null;
          preferred_language?: string;
          role?: Database["public"]["Enums"]["user_role"];
          status?: Database["public"]["Enums"]["profile_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      students: {
        Row: {
          admission_date: string;
          admission_number: string;
          created_at: string;
          date_of_birth: string;
          first_name: string;
          gender: string | null;
          id: string;
          last_name: string;
          middle_name: string | null;
          notes: string | null;
          photo_path: string | null;
          status: Database["public"]["Enums"]["student_status"];
          updated_at: string;
        };
        Insert: {
          admission_date?: string;
          admission_number: string;
          created_at?: string;
          date_of_birth: string;
          first_name: string;
          gender?: string | null;
          id?: string;
          last_name: string;
          middle_name?: string | null;
          notes?: string | null;
          photo_path?: string | null;
          status?: Database["public"]["Enums"]["student_status"];
          updated_at?: string;
        };
        Update: {
          admission_date?: string;
          admission_number?: string;
          created_at?: string;
          date_of_birth?: string;
          first_name?: string;
          gender?: string | null;
          id?: string;
          last_name?: string;
          middle_name?: string | null;
          notes?: string | null;
          photo_path?: string | null;
          status?: Database["public"]["Enums"]["student_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      teachers: {
        Row: {
          activated_at: string | null;
          created_at: string;
          employee_id: string;
          employment_status: Database["public"]["Enums"]["teacher_employment_status"];
          hire_date: string;
          id: string;
          invited_at: string;
          onboarding_status: Database["public"]["Enums"]["teacher_onboarding_status"];
          qualification: string | null;
          specialization: string | null;
          updated_at: string;
        };
        Insert: {
          activated_at?: string | null;
          created_at?: string;
          employee_id: string;
          employment_status?: Database["public"]["Enums"]["teacher_employment_status"];
          hire_date?: string;
          id: string;
          invited_at?: string;
          onboarding_status?: Database["public"]["Enums"]["teacher_onboarding_status"];
          qualification?: string | null;
          specialization?: string | null;
          updated_at?: string;
        };
        Update: {
          activated_at?: string | null;
          created_at?: string;
          employee_id?: string;
          employment_status?: Database["public"]["Enums"]["teacher_employment_status"];
          hire_date?: string;
          id?: string;
          invited_at?: string;
          onboarding_status?: Database["public"]["Enums"]["teacher_onboarding_status"];
          qualification?: string | null;
          specialization?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "teachers_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      deactivate_own_profile: {
        Args: { expected_user_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      guardian_relationship: "mother" | "father" | "guardian" | "foster_parent" | "other";
      parent_onboarding_status: "invited" | "active";
      profile_status: "active" | "inactive" | "suspended";
      student_status: "active" | "inactive" | "graduated" | "withdrawn";
      teacher_employment_status: "active" | "on_leave" | "former";
      teacher_onboarding_status: "invited" | "active";
      user_role: "parent" | "teacher" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      guardian_relationship: ["mother", "father", "guardian", "foster_parent", "other"],
      parent_onboarding_status: ["invited", "active"],
      profile_status: ["active", "inactive", "suspended"],
      student_status: ["active", "inactive", "graduated", "withdrawn"],
      teacher_employment_status: ["active", "on_leave", "former"],
      teacher_onboarding_status: ["invited", "active"],
      user_role: ["parent", "teacher", "admin"],
    },
  },
} as const;
