import { Construct } from 'constructs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

interface SsmVariableGroupProps {
  pathPrefix: string;
  variables: Array<{ key: string; value: string }>;
}

export class SsmVariableGroup extends Construct {
  constructor(scope: Construct, id: string, props: SsmVariableGroupProps) {
    super(scope, id);

    for (const variable of props.variables) {
      new StringParameter(this, `SsmStringParameter_${variable.key}`, {
        parameterName: `${props.pathPrefix}/${variable.key}`,
        stringValue: variable.value,
      });
    }
  }
}
