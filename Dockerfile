FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia os .csproj necessários antes do restore para que ProjectReference funcione
COPY ["src/Planner.Web/Planner.Web.csproj", "src/Planner.Web/"]
COPY ["src/Planner.Application/Planner.Application.csproj", "src/Planner.Application/"]
COPY ["src/Planner.Domain/Planner.Domain.csproj", "src/Planner.Domain/"]
COPY ["src/Planner.Infrastructure/Planner.Infrastructure.csproj", "src/Planner.Infrastructure/"]

RUN dotnet restore "src/Planner.Web/Planner.Web.csproj"

# copia o restante do código
COPY . .
WORKDIR "/src/src/Planner.Web"
RUN dotnet build "Planner.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Planner.Web.csproj" -c Release -o /app/publish

# copia build estático do cliente (assume que você rodou npm run build localmente)
COPY src/Planner.Web/ClientApp/dist /app/publish/wwwroot

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Planner.Web.dll"]