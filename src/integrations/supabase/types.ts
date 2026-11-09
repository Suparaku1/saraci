export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_user_connections: {
        Row: {
          connection_key_ciphertext: string
          connector_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connection_key_ciphertext: string
          connector_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connection_key_ciphertext?: string
          connector_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      appointment_events: {
        Row: {
          appointment_id: string
          created_at: string
          event_type: string
          id: string
          payload: Json | null
          user_id: string | null
        }
        Insert: {
          appointment_id: string
          created_at?: string
          event_type: string
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Update: {
          appointment_id?: string
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_events_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          booking_code: string
          cancelled_reason: string | null
          clinical_notes: string | null
          created_at: string
          gcal_event_id: string | null
          id: string
          notes: string | null
          patient_email: string | null
          patient_gcal_event_id: string | null
          patient_name: string
          patient_phone: string
          reminder_24h_sent_at: string | null
          reminder_2h_sent_at: string | null
          rescheduled_to: string | null
          service: string | null
          slot_start: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_code?: string
          cancelled_reason?: string | null
          clinical_notes?: string | null
          created_at?: string
          gcal_event_id?: string | null
          id?: string
          notes?: string | null
          patient_email?: string | null
          patient_gcal_event_id?: string | null
          patient_name: string
          patient_phone: string
          reminder_24h_sent_at?: string | null
          reminder_2h_sent_at?: string | null
          rescheduled_to?: string | null
          service?: string | null
          slot_start: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_code?: string
          cancelled_reason?: string | null
          clinical_notes?: string | null
          created_at?: string
          gcal_event_id?: string | null
          id?: string
          notes?: string | null
          patient_email?: string | null
          patient_gcal_event_id?: string | null
          patient_name?: string
          patient_phone?: string
          reminder_24h_sent_at?: string | null
          reminder_2h_sent_at?: string | null
          rescheduled_to?: string | null
          service?: string | null
          slot_start?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_rescheduled_to_fkey"
            columns: ["rescheduled_to"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          entity: string | null
          entity_id: string | null
          id: string
          payload: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      before_after: {
        Row: {
          after_path: string
          before_path: string
          consent_confirmed: boolean
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          published: boolean
          title: string
        }
        Insert: {
          after_path: string
          before_path: string
          consent_confirmed?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          published?: boolean
          title: string
        }
        Update: {
          after_path?: string
          before_path?: string
          consent_confirmed?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          published?: boolean
          title?: string
        }
        Relationships: []
      }
      calendar_blocks: {
        Row: {
          created_at: string
          end_ts: string
          gcal_event_id: string
          id: string
          start_ts: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_ts: string
          gcal_event_id: string
          id?: string
          start_ts: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_ts?: string
          gcal_event_id?: string
          id?: string
          start_ts?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      calendar_sync_log: {
        Row: {
          action: string
          appointment_id: string | null
          created_at: string
          direction: string
          error: string | null
          gcal_event_id: string | null
          id: string
          ok: boolean
        }
        Insert: {
          action: string
          appointment_id?: string | null
          created_at?: string
          direction: string
          error?: string | null
          gcal_event_id?: string | null
          id?: string
          ok?: boolean
        }
        Update: {
          action?: string
          appointment_id?: string | null
          created_at?: string
          direction?: string
          error?: string | null
          gcal_event_id?: string | null
          id?: string
          ok?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "calendar_sync_log_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          intent: string | null
          metadata: Json | null
          role: string
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          intent?: string | null
          metadata?: Json | null
          role: string
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          intent?: string | null
          metadata?: Json | null
          role?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clinic_faq: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      clinic_settings: {
        Row: {
          description: string | null
          is_public: boolean
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          description?: string | null
          is_public?: boolean
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          description?: string | null
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          admin_notes: string | null
          body: string
          contact: string | null
          created_at: string
          id: string
          priority: string
          resolved: boolean
          status: Database["public"]["Enums"]["complaint_status"]
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          body: string
          contact?: string | null
          created_at?: string
          id?: string
          priority?: string
          resolved?: boolean
          status?: Database["public"]["Enums"]["complaint_status"]
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          body?: string
          contact?: string | null
          created_at?: string
          id?: string
          priority?: string
          resolved?: boolean
          status?: Database["public"]["Enums"]["complaint_status"]
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_log: {
        Row: {
          attempts: number
          body: string
          created_at: string
          error: string | null
          html: string | null
          id: string
          related_appointment: string | null
          sent_at: string | null
          status: string
          subject: string
          template: string | null
          to_email: string
        }
        Insert: {
          attempts?: number
          body: string
          created_at?: string
          error?: string | null
          html?: string | null
          id?: string
          related_appointment?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          template?: string | null
          to_email: string
        }
        Update: {
          attempts?: number
          body?: string
          created_at?: string
          error?: string | null
          html?: string | null
          id?: string
          related_appointment?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          template?: string | null
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_log_related_appointment_fkey"
            columns: ["related_appointment"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      error_log: {
        Row: {
          created_at: string
          id: string
          message: string
          path: string | null
          stack: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          path?: string | null
          stack?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          path?: string | null
          stack?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          active: boolean
          category: string | null
          created_at: string
          id: string
          min_quantity: number
          name: string
          notes: string | null
          quantity: number
          supplier: string | null
          unit: string
          unit_cost: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string | null
          created_at?: string
          id?: string
          min_quantity?: number
          name: string
          notes?: string | null
          quantity?: number
          supplier?: string | null
          unit?: string
          unit_cost?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string | null
          created_at?: string
          id?: string
          min_quantity?: number
          name?: string
          notes?: string | null
          quantity?: number
          supplier?: string | null
          unit?: string
          unit_cost?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          appointment_id: string | null
          created_at: string
          currency: string
          id: string
          notes: string | null
          provider: string
          provider_ref: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          provider?: string
          provider_ref?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          provider?: string
          provider_ref?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      private_job_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          clinical_notes: string | null
          company_role: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          id: string
          medical_history: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          clinical_notes?: string | null
          company_role?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          medical_history?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          clinical_notes?: string | null
          company_role?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          medical_history?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approved: boolean
          comment: string
          created_at: string
          display_name: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          approved?: boolean
          comment: string
          created_at?: string
          display_name: string
          id?: string
          rating: number
          user_id?: string
        }
        Update: {
          approved?: boolean
          comment?: string
          created_at?: string
          display_name?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: []
      }
      service_catalog: {
        Row: {
          active: boolean
          description: string | null
          duration_minutes: number
          id: string
          name: string
          price_hint: string | null
        }
        Insert: {
          active?: boolean
          description?: string | null
          duration_minutes?: number
          id?: string
          name: string
          price_hint?: string | null
        }
        Update: {
          active?: boolean
          description?: string | null
          duration_minutes?: number
          id?: string
          name?: string
          price_hint?: string | null
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          item_id: string
          movement_type: string
          quantity: number
          reason: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id: string
          movement_type: string
          quantity: number
          reason?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          item_id?: string
          movement_type?: string
          quantity?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      voice_transcripts: {
        Row: {
          created_at: string
          id: string
          reply: string | null
          session_id: string | null
          transcript: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reply?: string | null
          session_id?: string | null
          transcript: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reply?: string | null
          session_id?: string | null
          transcript?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_transcripts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_calendar_block_ranges: {
        Args: { range_end: string; range_start: string }
        Returns: {
          end_ts: string
          start_ts: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "user"
      appointment_status:
        | "booked"
        | "cancelled"
        | "rescheduled"
        | "completed"
        | "no_show"
      complaint_status: "open" | "in_progress" | "resolved" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "user"],
      appointment_status: [
        "booked",
        "cancelled",
        "rescheduled",
        "completed",
        "no_show",
      ],
      complaint_status: ["open", "in_progress", "resolved", "closed"],
    },
  },
} as const
