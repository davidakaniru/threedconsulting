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
      class_sessions: {
        Row: {
          cohort_id: string | null;
          lesson_assignment_id: string | null;
          created_at: string;
          created_by: string;
          description: string | null;
          end_time: string;
          id: string;
          meeting_link: string;
          session_date: string;
          start_time: string;
          status: Database["public"]["Enums"]["class_session_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          cohort_id?: string | null;
          lesson_assignment_id?: string | null;
          created_at?: string;
          created_by: string;
          description?: string | null;
          end_time: string;
          id?: string;
          meeting_link: string;
          session_date: string;
          start_time: string;
          status?: Database["public"]["Enums"]["class_session_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          cohort_id?: string | null;
          lesson_assignment_id?: string | null;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          end_time?: string;
          id?: string;
          meeting_link?: string;
          session_date?: string;
          start_time?: string;
          status?: Database["public"]["Enums"]["class_session_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "class_sessions_cohort_id_fkey";
            columns: ["cohort_id"];
            isOneToOne: false;
            referencedRelation: "cohorts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "class_sessions_lesson_assignment_id_fkey";
            columns: ["lesson_assignment_id"];
            isOneToOne: false;
            referencedRelation: "lesson_assignments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "class_sessions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      session_attendance: {
        Row: {
          created_at: string;
          id: string;
          marked_at: string | null;
          marked_by: string | null;
          notes: string | null;
          session_id: string;
          status: Database["public"]["Enums"]["attendance_status"];
          student_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          marked_at?: string | null;
          marked_by?: string | null;
          notes?: string | null;
          session_id: string;
          status?: Database["public"]["Enums"]["attendance_status"];
          student_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          marked_at?: string | null;
          marked_by?: string | null;
          notes?: string | null;
          session_id?: string;
          status?: Database["public"]["Enums"]["attendance_status"];
          student_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_attendance_marked_by_fkey";
            columns: ["marked_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_attendance_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "class_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_attendance_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      homework: {
        Row: {
          created_at: string;
          created_by: string;
          due_at: string;
          id: string;
          instructions: string;
          maximum_score: number | null;
          session_id: string;
          status: Database["public"]["Enums"]["homework_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          due_at: string;
          id?: string;
          instructions: string;
          maximum_score?: number | null;
          session_id: string;
          status?: Database["public"]["Enums"]["homework_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          due_at?: string;
          id?: string;
          instructions?: string;
          maximum_score?: number | null;
          session_id?: string;
          status?: Database["public"]["Enums"]["homework_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "homework_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "homework_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "class_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      homework_submissions: {
        Row: {
          created_at: string;
          feedback: string | null;
          graded_at: string | null;
          graded_by: string | null;
          homework_id: string;
          id: string;
          score: number | null;
          status: Database["public"]["Enums"]["homework_submission_status"];
          student_id: string;
          submission_text: string | null;
          submitted_at: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          feedback?: string | null;
          graded_at?: string | null;
          graded_by?: string | null;
          homework_id: string;
          id?: string;
          score?: number | null;
          status?: Database["public"]["Enums"]["homework_submission_status"];
          student_id: string;
          submission_text?: string | null;
          submitted_at?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          feedback?: string | null;
          graded_at?: string | null;
          graded_by?: string | null;
          homework_id?: string;
          id?: string;
          score?: number | null;
          status?: Database["public"]["Enums"]["homework_submission_status"];
          student_id?: string;
          submission_text?: string | null;
          submitted_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "homework_submissions_graded_by_fkey";
            columns: ["graded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "homework_submissions_homework_id_fkey";
            columns: ["homework_id"];
            isOneToOne: false;
            referencedRelation: "homework";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "homework_submissions_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      cohorts: {
        Row: {
          capacity: number;
          code: string;
          created_at: string;
          created_by: string | null;
          description: string | null;
          expected_end_date: string | null;
          id: string;
          name: string;
          start_date: string;
          status: Database["public"]["Enums"]["cohort_status"];
          teaching_assignment_id: string;
          updated_at: string;
        };
        Insert: {
          capacity?: number;
          code: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          expected_end_date?: string | null;
          id?: string;
          name: string;
          start_date: string;
          status?: Database["public"]["Enums"]["cohort_status"];
          teaching_assignment_id: string;
          updated_at?: string;
        };
        Update: {
          capacity?: number;
          code?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          expected_end_date?: string | null;
          id?: string;
          name?: string;
          start_date?: string;
          status?: Database["public"]["Enums"]["cohort_status"];
          teaching_assignment_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cohorts_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cohorts_teaching_assignment_id_fkey";
            columns: ["teaching_assignment_id"];
            isOneToOne: false;
            referencedRelation: "teaching_assignments";
            referencedColumns: ["id"];
          },
        ];
      };
      cohort_students: {
        Row: {
          assigned_by: string | null;
          cohort_id: string;
          created_at: string;
          id: string;
          joined_at: string;
          left_at: string | null;
          status: Database["public"]["Enums"]["cohort_membership_status"];
          student_id: string;
          updated_at: string;
        };
        Insert: {
          assigned_by?: string | null;
          cohort_id: string;
          created_at?: string;
          id?: string;
          joined_at?: string;
          left_at?: string | null;
          status?: Database["public"]["Enums"]["cohort_membership_status"];
          student_id: string;
          updated_at?: string;
        };
        Update: {
          assigned_by?: string | null;
          cohort_id?: string;
          created_at?: string;
          id?: string;
          joined_at?: string;
          left_at?: string | null;
          status?: Database["public"]["Enums"]["cohort_membership_status"];
          student_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cohort_students_assigned_by_fkey";
            columns: ["assigned_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cohort_students_cohort_id_fkey";
            columns: ["cohort_id"];
            isOneToOne: false;
            referencedRelation: "cohorts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cohort_students_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          entity_id: string | null;
          entity_type: string;
          id: number;
          metadata: Json;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type: string;
          id?: number;
          metadata?: Json;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string;
          id?: number;
          metadata?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      parents: {
        Row: {
          activated_at: string | null;
          created_at: string;
          id: string;
          invited_at: string;
          occupation: string | null;
          onboarding_status: Database["public"]["Enums"]["parent_onboarding_status"];
          updated_at: string;
        };
        Insert: {
          activated_at?: string | null;
          created_at?: string;
          id: string;
          invited_at?: string;
          occupation?: string | null;
          onboarding_status?: Database["public"]["Enums"]["parent_onboarding_status"];
          updated_at?: string;
        };
        Update: {
          activated_at?: string | null;
          created_at?: string;
          id?: string;
          invited_at?: string;
          occupation?: string | null;
          onboarding_status?: Database["public"]["Enums"]["parent_onboarding_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "parents_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      programmes: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          name: string;
          slug: string;
          status: Database["public"]["Enums"]["programme_status"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          slug: string;
          status?: Database["public"]["Enums"]["programme_status"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          status?: Database["public"]["Enums"]["programme_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "programmes_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      student_parents: {
        Row: {
          created_at: string;
          is_primary_contact: boolean;
          parent_id: string;
          relationship: Database["public"]["Enums"]["guardian_relationship"];
          student_id: string;
        };
        Insert: {
          created_at?: string;
          is_primary_contact?: boolean;
          parent_id: string;
          relationship: Database["public"]["Enums"]["guardian_relationship"];
          student_id: string;
        };
        Update: {
          created_at?: string;
          is_primary_contact?: boolean;
          parent_id?: string;
          relationship?: Database["public"]["Enums"]["guardian_relationship"];
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "student_parents_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "parents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "student_parents_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
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
      teaching_assignments: {
        Row: {
          assigned_at: string;
          assigned_by: string | null;
          created_at: string;
          id: string;
          primary_instructor: boolean;
          programme_id: string;
          status: Database["public"]["Enums"]["teaching_assignment_status"];
          teacher_id: string;
          updated_at: string;
        };
        Insert: {
          assigned_at?: string;
          assigned_by?: string | null;
          created_at?: string;
          id?: string;
          primary_instructor?: boolean;
          programme_id: string;
          status?: Database["public"]["Enums"]["teaching_assignment_status"];
          teacher_id: string;
          updated_at?: string;
        };
        Update: {
          assigned_at?: string;
          assigned_by?: string | null;
          created_at?: string;
          id?: string;
          primary_instructor?: boolean;
          programme_id?: string;
          status?: Database["public"]["Enums"]["teaching_assignment_status"];
          teacher_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "teaching_assignments_assigned_by_fkey";
            columns: ["assigned_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teaching_assignments_programme_id_fkey";
            columns: ["programme_id"];
            isOneToOne: false;
            referencedRelation: "programmes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "teaching_assignments_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "teachers";
            referencedColumns: ["id"];
          },
        ];
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
          employee_id?: string;
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
      claim_open_lesson_request: {
        Args: { p_lesson_request_id: string; p_teacher_id: string };
        Returns: Json;
      };
      approve_enrolment_application: {
        Args: {
          p_application_id: string;
          p_assignments: Json;
          p_reviewer_id: string;
          p_review_notes?: string | null;
        };
        Returns: string;
      };
      deactivate_own_profile: {
        Args: { expected_user_id: string };
        Returns: undefined;
      };
      ensure_parent_record: {
        Args: { p_user_id: string };
        Returns: string;
      };
      update_session_attendance: {
        Args: { p_session_id: string; p_teacher_id: string; p_records: Json };
        Returns: number;
      };
    };
    Enums: {
      attendance_status: "pending" | "present" | "absent" | "late";
      class_session_status: "draft" | "scheduled" | "completed" | "cancelled";
      homework_status: "draft" | "published" | "closed";
      homework_submission_status: "pending" | "submitted" | "graded" | "late";
      guardian_relationship:
        | "mother"
        | "father"
        | "guardian"
        | "foster_parent"
        | "other";
      cohort_membership_status:
        | "active"
        | "transferred"
        | "completed"
        | "withdrawn";
      cohort_status: "draft" | "open" | "active" | "completed" | "archived";
      parent_onboarding_status: "invited" | "active";
      profile_status: "active" | "inactive" | "suspended";
      programme_status: "draft" | "published" | "archived";
      student_status: "active" | "inactive" | "graduated" | "withdrawn";
      teaching_assignment_status: "active" | "inactive";
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
      attendance_status: ["pending", "present", "absent", "late"],
      class_session_status: ["draft", "scheduled", "completed", "cancelled"],
      cohort_membership_status: [
        "active",
        "transferred",
        "completed",
        "withdrawn",
      ],
      cohort_status: ["draft", "open", "active", "completed", "archived"],
      homework_status: ["draft", "published", "closed"],
      homework_submission_status: ["pending", "submitted", "graded", "late"],
      guardian_relationship: [
        "mother",
        "father",
        "guardian",
        "foster_parent",
        "other",
      ],
      parent_onboarding_status: ["invited", "active"],
      profile_status: ["active", "inactive", "suspended"],
      programme_status: ["draft", "published", "archived"],
      student_status: ["active", "inactive", "graduated", "withdrawn"],
      teaching_assignment_status: ["active", "inactive"],
      teacher_employment_status: ["active", "on_leave", "former"],
      teacher_onboarding_status: ["invited", "active"],
      user_role: ["parent", "teacher", "admin"],
    },
  },
} as const;
