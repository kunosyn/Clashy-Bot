import { LEAGUE_COLORS } from "../globals"

export const getLeagueColor = ( leagueName: string | null | undefined ) => {
    if (!leagueName) return 0xffffff
    var color 

    if (leagueName.startsWith('Legend'))
        color = LEAGUE_COLORS.Legend
    else if (leagueName.startsWith('Titan'))
        color = LEAGUE_COLORS.Titan
    else if (leagueName.startsWith('Champion'))
        color = LEAGUE_COLORS.Champion
    else if (leagueName.startsWith('Master'))
        color = LEAGUE_COLORS.Master
    else if (leagueName.startsWith('Crystal'))
        color = LEAGUE_COLORS.Crystal
    else if (leagueName.startsWith('Gold'))
        color = LEAGUE_COLORS.Gold
    else if (leagueName.startsWith('Silver'))
        color = LEAGUE_COLORS.Silver
    else if (leagueName.startsWith('Bronze'))
        color = LEAGUE_COLORS.Bronze

    return color ?? 0xffffff
}