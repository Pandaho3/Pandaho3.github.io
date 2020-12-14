

# stacks

- a collection of AWS resources that can manage as a single unit.
- create, update, or delete `a collection of resources` by creating, updating, or deleting `stacks`.
- All the resources in a stack are defined by the stack's `AWS CloudFormation template`.
- for example:
  - A stack can include all the resources required to run a web application, such as a web server, a database, and networking rules.
  - If no longer require that web application, can simply delete the stack, and all of its related resources are deleted.

<kbd>AWS CloudFormation</kbd> ensures all `stack resources` are created or deleted as appropriate.
- Because AWS CloudFormation treats the stack resources as a single unit, they must all be created or deleted successfully for the stack to be created or deleted.
- If a resource cannot be created, AWS CloudFormation rolls the stack back and automatically deletes any resources that were created.
- If a resource cannot be deleted, any remaining resources are retained until the stack can be successfully deleted.
- can work with stacks by using the `AWS CloudFormation console, API`, or AWS CLI.

---



## Working with nested stacks

Nested stacks are stacks created as part of other stacks.
- create a nested stack within another stack by using the `AWS::CloudFormation::Stack resource`.

As infrastructure grows, to declare the same components in multiple templates.
- you can separate out these common components and create dedicated templates for them.
- Then use the resource in your template to reference other templates, creating `nested stacks`.

> For example,
> a load balancer configuration that use for most of your stacks.
> Instead of copying and pasting the same configurations into your templates,
> create a dedicated template for the load balancer.
> Then, just use the resource to reference that template from within other templates.


Nested stacks can themselves contain other nested stacks, 
- resulting in a **hierarchy of stacks**

![cfn-console-nested-stacks](https://i.imgur.com/TU6BesT.png)

The `root stack`: 
- the top-level stack to which all the nested stacks ultimately belong. 
- each nested stack has an immediate parent stack. 
- For the first level of nested stacks, the root stack is also the parent stack.

> Stack A is the `root stack` for all the other, nested, stacks in the hierarchy.
> For stack B, stack A is both the `parent stack`, as well as the `root stack`.
> For stack D, stack C is the `parent stack`;
> for stack C, stack B is the `parent stack`.


Using nested stacks to declare common components is considered a **best practice**.

Certain stack operations, such as stack updates, should be initiated from the `root stack` rather than performed directly on `nested stacks themselves`. 


To view the root stack of a nested stack
1. <kbd>AWS Management Console</kbd> -> <kbd>AWS CloudFormation console</kbd> -> Select the <kbd>stack</kbd> that want.
2. Nested stacks display `NESTED` next to their stack name.
3. <kbd>Overview tab</kbd>: click the stack name listed as `Root stack`.


To view the nested stacks that belong to a root stack
1. <kbd>AWS Management Console</kbd> -> <kbd>AWS CloudFormation console</kbd> -> Click the name of the root stack whose nested stacks want to view.
2. Expand the <kbd>Resources</kbd> section.
3. Look for resources of type `AWS::CloudFormation::Stack`.










.
