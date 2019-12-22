/* eslint-disable class-methods-use-this */
import { singularize, tableize, underscore } from "inflection";
import { DefaultNamingStrategy, NamingStrategyInterface } from "typeorm";

export class NamingStrategy extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  tableName(targetName: string, userSpecifiedName?: string): string {
    return userSpecifiedName || tableize(targetName);
  }

  columnName(
    propertyName: string,
    customName: string | undefined,
    embeddedPrefixes: string[]
  ): string {
    const columnName = underscore(customName || propertyName);
    return embeddedPrefixes.length
      ? `${embeddedPrefixes.join("_")}_${columnName}`
      : columnName;
  }

  relationName(propertyName: string): string {
    return underscore(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return `${relationName}_${referencedColumnName}`;
  }

  joinTableName(firstTableName: string, secondTableName: string): string {
    return `${firstTableName}_${secondTableName}`;
  }

  joinTableColumnDuplicationPrefix(columnName: string, index: number): string {
    return `${columnName}_${index}`;
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string
  ): string {
    return `${singularize(tableName)}_${columnName || propertyName}`;
  }
}
