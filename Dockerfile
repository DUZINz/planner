FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["src/Planner.Web/Planner.Web.csproj", "src/Planner.Web/"]
RUN dotnet restore "src/Planner.Web/Planner.Web.csproj"
COPY . .
WORKDIR "/src/src/Planner.Web"
RUN dotnet build "Planner.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Planner.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Planner.Web.dll"]