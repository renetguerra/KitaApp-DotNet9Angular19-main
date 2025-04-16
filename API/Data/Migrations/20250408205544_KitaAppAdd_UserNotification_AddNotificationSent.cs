using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class KitaAppAdd_UserNotification_AddNotificationSent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateRead",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "IsDone",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "NotificationSent",
                table: "Notifications");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateRead",
                table: "UserNotifications",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDone",
                table: "UserNotifications",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "NotificationSent",
                table: "UserNotifications",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateRead",
                table: "UserNotifications");

            migrationBuilder.DropColumn(
                name: "IsDone",
                table: "UserNotifications");

            migrationBuilder.DropColumn(
                name: "NotificationSent",
                table: "UserNotifications");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateRead",
                table: "Notifications",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDone",
                table: "Notifications",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "NotificationSent",
                table: "Notifications",
                type: "datetime2",
                nullable: true);
        }
    }
}
