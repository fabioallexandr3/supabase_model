import { ScaffoldDivider } from 'components/layouts/Scaffold'
import { useOrgIntegrationsQuery } from 'data/integrations/integrations-query-org-only'
import { useVercelProjectsQuery } from 'data/integrations/integrations-vercel-projects-query'
import { useSelectedOrganization } from 'hooks'
import Integration from './Integration'
import SidePanelVercelProjectLinker from './SidePanelVercelProjectLinker'

const IntegrationSettings = () => {
  const org = useSelectedOrganization()
  const { data } = useOrgIntegrationsQuery({ orgSlug: org?.slug })

  const vercelIntegrations = data?.filter(
    (integration) => integration.integration.name === 'Vercel'
  ) // vercel
  const githubIntegrations = data?.filter(
    (integration) => integration.integration.name === 'GitHub'
  ) // github

  vercelIntegrations?.forEach((x) => {
    let data: any = { ...x }

    const avatarSrc = data.metadata.account.avatar
      ? `https://vercel.com/api/www/avatar/${data.metadata.account.avatar}?s=48`
      : `https://vercel.com/api/www/avatar?teamId=${data.metadata.account.team_id}&s=48`

    data['metadata']['account']['avatar'] = avatarSrc
  })

  // We're only supporting one Vercel integration per org for now
  // this will need to be updated when we support multiple integrations
  const vercelIntegration = vercelIntegrations?.[0]
  const { data: vercelProjectsData } = useVercelProjectsQuery(
    {
      organization_integration_id: vercelIntegration?.id,
    },
    { enabled: vercelIntegration?.id !== undefined }
  )
  const vercelProjectCount = vercelProjectsData?.length ?? 0

  return (
    <>
      <Integration
        title="Vercel"
        orgName={org?.name}
        detail={`
## Vercel Integration

Connect your Vercel teams to your Supabase organization.
`}
        description={`
### How does the Vercel integration work?

Supabase will keep the right environment variables up to date in each of the projects you assign to a Supabase project. 
You can also link multiple Vercel Projects to the same Supabase project.
`}
        note={
          vercelProjectCount > 0
            ? `
Your Vercel connection has access to ${vercelProjectCount} Vercel Projects. 
You can change the scope of the access for Supabase by configuring [here](https://vercel.com/dashboard/integrations/${vercelIntegration?.metadata?.configuration_id}).
`
            : undefined
        }
        integrations={vercelIntegrations}
      />
      <ScaffoldDivider />
      <Integration
        title="GitHub"
        orgName={org?.name}
        detail={`
## GitHub Connections

Connect any of your GitHub repositories to a project.
`}
        description={`
GitHub connections are coming soon.

### How will GitHub connections work?

You will be able to connect a GitHub repository to a Supabase project. 
The GitHub app will watch for changes in your repository such as file changes, branch changes as well as pull request activity.

These connections will be part of a GitHub workflow that is currently in development.
`}
        integrations={githubIntegrations}
      />
      <SidePanelVercelProjectLinker />
    </>
  )
}

export default IntegrationSettings
