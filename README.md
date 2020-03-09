# koa-casbin

## 对 Casbin 权限库，测试研究总结

- [role_definition]
- g = _, _
- g2 = _, _
- g3 = _, _, \_
- g, g2, g3 表示不同的 RBAC 体系, _,_ 示用户和角色 _,_,\_ 表示用户,角色,域(也就是租户)
- g, alice, data2_admin
- 表示 alice 属于角色 data2_admin
- 前项继承后项角色

- [policy_definition]
- p = sub, obj, act, [allow]
- policy 默认的最后一个属性为决策结果 字段名 eft 默认值为 allow 即通过情况下 p.eft 就设置为 allow

* e = some(where (p.eft == allow))
* 将 request 和所有 policy 比对完之后 所有 policy 的策略结果（p.eft）为 allow 的个数 >=1，整个请求的策略就是为 true



  ```golang
    // RBAC1
    // [request_definition]
    //r = sub, obj, act

    // [policy_definition]
    // p = sub, obj, act

    // [role_definition]
    // g = _, _
    // g2 = _, _

    // [policy_effect]
    // e = some(where (p.eft == allow))

    // [matchers]
    // m = g(r.sub, p.sub) && g2(r.obj, p.obj) && r.act == p.act

     //管理员
    enforcer.AddPermissionForUser("role:admin", "ad_campaign", "GET")
    enforcer.AddPermissionForUser("role:admin", "ad_campaign", "LIST")

    //区域管理员
    enforcer.AddPermissionForUser("role:area_ad_admin", "campaign", "WRITE")
    enforcer.AddPermissionForUser("role:area_ad_admin", "adgroup", "WRITE")
    enforcer.AddPermissionForUser("role:area_ad_admin", "adcreative", "WRITE")

    //将area_ad_admin的角色分配给admin
    enforcer.AddRoleForUser("role:admin", "role:area_ad_admin")

    //最终用户
    enforcer.AddRoleForUser("kevin", "role:admin")
    enforcer.SavePolicy()
    //print.
    fmt.Printf("%#v", e.GetImplicitPermissionsForUser("kevin"))
    ```
