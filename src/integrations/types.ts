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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_status: string
          created_at: string
          id: string
          payment_status: string
          seats: string[]
          showtime_id: string
          ticket_code: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_status?: string
          created_at?: string
          id?: string
          payment_status?: string
          seats: string[]
          showtime_id: string
          ticket_code: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_status?: string
          created_at?: string
          id?: string
          payment_status?: string
          seats?: string[]
          showtime_id?: string
          ticket_code?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_showtime_id_fkey"
            columns: ["showtime_id"]
            isOneToOne: false
            referencedRelation: "showtimes"
            referencedColumns: ["id"]
          },
        ]
      }
      movies: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          genre: string
          id: string
          is_active: boolean
          language: string | null
          poster_url: string | null
          rating: string | null
          release_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          genre: string
          id?: string
          is_active?: boolean
          language?: string | null
          poster_url?: string | null
          rating?: string | null
          release_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          genre?: string
          id?: string
          is_active?: boolean
          language?: string | null
          poster_url?: string | null
          rating?: string | null
          release_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          mobile_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          mobile_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          mobile_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      showtimes: {
        Row: {
          base_price: number
          created_at: string
          id: string
          is_active: boolean
          movie_id: string
          premium_price: number
          show_date: string
          show_time: string
          theatre_id: string
          updated_at: string
        }
        Insert: {
          base_price?: number
          created_at?: string
          id?: string
          is_active?: boolean
          movie_id: string
          premium_price?: number
          show_date: string
          show_time: string
          theatre_id: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          created_at?: string
          id?: string
          is_active?: boolean
          movie_id?: string
          premium_price?: number
          show_date?: string
          show_time?: string
          theatre_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "showtimes_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showtimes_theatre_id_fkey"
            columns: ["theatre_id"]
            isOneToOne: false
            referencedRelation: "theatres"
            referencedColumns: ["id"]
          },
        ]
      }
      theatres: {
        Row: {
          city: string
          created_at: string
          id: string
          location: string
          name: string
          seats_per_row: number
          total_rows: number
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          location: string
          name: string
          seats_per_row?: number
          total_rows?: number
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          seats_per_row?: number
          total_rows?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_ticket_code: { Args: never; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
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
      app_role: "admin" | "user"
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "user"],
      gender_type: ["male", "female", "other", "prefer_not_to_say"],
    },
  },
} as const
