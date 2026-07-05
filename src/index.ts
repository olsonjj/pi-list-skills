/**
 * pi-list-skills — List all loaded skills
 *
 * Registers:
 *   /list-skills  — interactive command that displays skills in a select UI
 *   list_skills   — tool the LLM can call to enumerate loaded skills
 *
 * Usage:
 *   pi install github:<user>/pi-list-skills
 *   # or copy to ~/.pi/agent/extensions/
 */

import type { ExtensionAPI, SlashCommandInfo } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function listSkillsExtension(pi: ExtensionAPI) {
  // ── /list-skills command ──────────────────────────────────────────────
  pi.registerCommand("list-skills", {
    description: "List all loaded skills with descriptions and locations",

    handler: async (_args, ctx) => {
      // Gather skills from two sources:
      // 1. pi.getCommands() — gives us skill commands with source paths
      // 2. ctx.getSystemPromptOptions() — gives us richer skill metadata

      const allCommands = pi.getCommands();
      const skillCommands = allCommands.filter(
        (c): c is SlashCommandInfo & { source: "skill" } => c.source === "skill",
      );

      if (skillCommands.length === 0) {
        ctx.ui.notify("No skills loaded", "info");
        return;
      }

      // Try to get richer skill data from system prompt options
      let skillMeta: Array<{ name: string; description: string }> = [];
      try {
        const opts = ctx.getSystemPromptOptions();
        skillMeta = opts.skills ?? [];
      } catch {
        // getSystemPromptOptions may not be available in all contexts
      }

      // Build a lookup of description by name
      const metaByName = new Map(skillMeta.map((s) => [s.name, s.description]));

      // Build display items
      const items: string[] = [];
      const skillList: Array<{ name: string; description: string; path: string }> = [];

      for (const cmd of skillCommands) {
        const desc = metaByName.get(cmd.name) ?? cmd.description ?? "(no description)";
        const path = cmd.sourceInfo?.path ?? "(unknown)";
        skillList.push({ name: cmd.name, description: desc, path });

        // Truncate long descriptions for the select UI
        const shortDesc = desc.length > 60 ? desc.slice(0, 57) + "..." : desc;
        items.push(`${cmd.name}  —  ${shortDesc}`);
      }

      // Show in a selector so the user can scroll
      const selected = await ctx.ui.select(
        `Loaded Skills (${skillList.length})`,
        items,
      );

      if (selected) {
        // Extract skill name from the selected line
        const skillName = selected.split("  —  ")[0];
        const skill = skillList.find((s) => s.name === skillName);
        if (skill) {
          const detail = [
            `Name: ${skill.name}`,
            `Description: ${skill.description}`,
            `Location: ${skill.path}`,
          ].join("\n");
          ctx.ui.notify(detail, "info");
        }
      }
    },
  });

  // ── list_skills tool ─────────────────────────────────────────────────
  pi.registerTool({
    name: "list_skills",
    label: "List Skills",
    description:
      "List all loaded skills with their names, descriptions, and file locations. Use this when the user asks what skills are available.",
    parameters: Type.Object({}),

    async execute(_toolCallId, _params, _signal, _onUpdate, _ctx) {
      const allCommands = pi.getCommands();
      const skillCommands = allCommands.filter((c) => c.source === "skill");

      if (skillCommands.length === 0) {
        return {
          content: [{ type: "text", text: "No skills are currently loaded." }],
          details: { count: 0, skills: [] },
        };
      }

      const lines: string[] = [];
      const skills: Array<{ name: string; description: string; path: string }> = [];

      for (const cmd of skillCommands) {
        const desc = cmd.description ?? "(no description)";
        const path = cmd.sourceInfo?.path ?? "(unknown)";
        skills.push({ name: cmd.name, description: desc, path });

        lines.push(`- **${cmd.name}**: ${desc}`);
        lines.push(`  Location: \`${path}\``);
      }

      const header = `## Loaded Skills (${skills.length})\n\n`;
      const text = header + lines.join("\n");

      return {
        content: [{ type: "text", text }],
        details: { count: skills.length, skills },
      };
    },
  });
}
