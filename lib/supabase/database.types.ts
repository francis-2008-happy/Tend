
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "about_me": {
                  Row: {
                    "budget_band": string | null,"completed_at": string | null,"created_at": string,"free_time": (string)[],"interests": (string)[],"kids": string | null,"love_languages": (string)[],"shared_fields": (string)[],"surprise_style": string | null,"updated_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "budget_band"?: string | null,"completed_at"?: string | null,"created_at"?: string,"free_time"?: (string)[],"interests"?: (string)[],"kids"?: string | null,"love_languages"?: (string)[],"shared_fields"?: (string)[],"surprise_style"?: string | null,"updated_at"?: string,"user_id"?: string
                  }
                  Update: {
                    "budget_band"?: string | null,"completed_at"?: string | null,"created_at"?: string,"free_time"?: (string)[],"interests"?: (string)[],"kids"?: string | null,"love_languages"?: (string)[],"shared_fields"?: (string)[],"surprise_style"?: string | null,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"couple_members": {
                  Row: {
                    "couple_id": string,"joined_at": string,"role": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "couple_id": string,"joined_at"?: string,"role": string,"user_id": string
                  }
                  Update: {
                    "couple_id"?: string,"joined_at"?: string,"role"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "couple_members_couple_id_fkey"
      columns: ["couple_id"]
isOneToOne: false
      referencedRelation: "couples"
      referencedColumns: ["id"]
    }
                  ]
                },"couples": {
                  Row: {
                    "anniversary": string | null,"created_at": string,"created_by": string | null,"ended_at": string | null,"id": string,"plan": string,"season": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "anniversary"?: string | null,"created_at"?: string,"created_by"?: string | null,"ended_at"?: string | null,"id"?: string,"plan"?: string,"season"?: string | null
                  }
                  Update: {
                    "anniversary"?: string | null,"created_at"?: string,"created_by"?: string | null,"ended_at"?: string | null,"id"?: string,"plan"?: string,"season"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"invite_attempts": {
                  Row: {
                    "attempted_at": string,"id": number,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "attempted_at"?: string,"id"?: never,"user_id": string
                  }
                  Update: {
                    "attempted_at"?: string,"id"?: never,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"invites": {
                  Row: {
                    "cancelled_at": string | null,"code": string,"couple_id": string,"created_at": string,"created_by": string,"expires_at": string,"id": string,"token": string,"used_at": string | null,"used_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "cancelled_at"?: string | null,"code": string,"couple_id": string,"created_at"?: string,"created_by": string,"expires_at"?: string,"id"?: string,"token": string,"used_at"?: string | null,"used_by"?: string | null
                  }
                  Update: {
                    "cancelled_at"?: string | null,"code"?: string,"couple_id"?: string,"created_at"?: string,"created_by"?: string,"expires_at"?: string,"id"?: string,"token"?: string,"used_at"?: string | null,"used_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "invites_couple_id_fkey"
      columns: ["couple_id"]
isOneToOne: false
      referencedRelation: "couples"
      referencedColumns: ["id"]
    }
                  ]
                },"my_settings": {
                  Row: {
                    "faith_pack": boolean,"updated_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "faith_pack"?: boolean,"updated_at"?: string,"user_id"?: string
                  }
                  Update: {
                    "faith_pack"?: boolean,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"private_entries": {
                  Row: {
                    "content": NonNullable<Json>,"created_at": string,"id": string,"owner_id": string,"type": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "content"?: NonNullable<Json>,"created_at"?: string,"id"?: string,"owner_id"?: string,"type": string,"updated_at"?: string
                  }
                  Update: {
                    "content"?: NonNullable<Json>,"created_at"?: string,"id"?: string,"owner_id"?: string,"type"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"profiles": {
                  Row: {
                    "avatar_path": string | null,"created_at": string,"display_name": string,"id": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "avatar_path"?: string | null,"created_at"?: string,"display_name"?: string,"id": string,"updated_at"?: string
                  }
                  Update: {
                    "avatar_path"?: string | null,"created_at"?: string,"display_name"?: string,"id"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"shared_items": {
                  Row: {
                    "content": NonNullable<Json>,"couple_id": string,"created_at": string,"created_by": string | null,"id": string,"type": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "content"?: NonNullable<Json>,"couple_id": string,"created_at"?: string,"created_by"?: string | null,"id"?: string,"type": string,"updated_at"?: string
                  }
                  Update: {
                    "content"?: NonNullable<Json>,"couple_id"?: string,"created_at"?: string,"created_by"?: string | null,"id"?: string,"type"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "shared_items_couple_id_fkey"
      columns: ["couple_id"]
isOneToOne: false
      referencedRelation: "couples"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "_leave_ended_space":
{ Args: { "uid": string }; Returns: undefined
                           },
"create_couple":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"create_invite":
{ Args: Record<PropertyKey, never>; Returns: {
              "code": string,"expires_at": string,"status": string,"token": string
            }[]
                           },
"delete_my_account":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"export_my_data":
{ Args: Record<PropertyKey, never>; Returns: Json
                           },
"invite_preview":
{ Args: { "link_token": string }; Returns: {
              "inviter_name": string,"status": string
            }[]
                           },
"is_member":
{ Args: { "target": string }; Returns: boolean
                           },
"leave_couple":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"partner_about_me":
{ Args: Record<PropertyKey, never>; Returns: {
              "budget_band": string,"free_time": (string)[],"interests": (string)[],"kids": string,"love_languages": (string)[],"partner_name": string,"surprise_style": string
            }[]
                           },
"redeem_invite":
{ Args: { "code_or_token": string }; Returns: string
                           },
"shares_couple_with":
{ Args: { "other": string }; Returns: boolean
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const
